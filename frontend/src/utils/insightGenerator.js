/**
 * Insight rules for JobLens (this file).
 *
 * `generateJobInsightsThing(jobListDataThing)` counts jobs by status, groups jobs by
 * normalized role for per-role rejection patterns, and pushes messages when thresholds pass.
 *
 * Thresholds: see INSIGHT_THRESHOLDS — each rule runs only when its minimums (and rates) are met.
 *
 * Rules (brief):
 * - Low interview rate: enough “active” applications but interviews are a small share.
 * - High rejections: rejection count is high overall.
 * - Too many apply later: many jobs still parked in Apply Later.
 * - Role rejection pattern: for a given normalized role, enough volume, enough rejections,
 *   and rejection rate above threshold (dynamic role name in copy).
 */

import { normalizeJobRoleTitle, roleKeyForMatching } from './roleNormalize';

const INSIGHT_THRESHOLDS = {
  lowInterviewMinApplied: 4,
  lowInterviewMaxRate: 0.25,
  highRejectionsMin: 3,
  tooManyApplyLaterMin: 5,
  /** Minimum total jobs in a role bucket to consider a role-pattern insight */
  rolePatternMinJobs: 3,
  rolePatternMinRejections: 2,
  rolePatternMinRejectionRate: 0.5,
};

function normalizeStatus(statusValue) {
  return (statusValue || '').toString().trim().toLowerCase();
}

/** Group jobs by normalized role key; label is title-case for messages. */
function groupJobsByNormalizedRole(jobs) {
  const map = new Map();
  for (const job of jobs) {
    const key = roleKeyForMatching(job?.role ?? '');
    if (!key) continue;

    const label = normalizeJobRoleTitle(job?.role ?? '') || key;
    if (!map.has(key)) {
      map.set(key, { label, jobs: [] });
    }
    map.get(key).jobs.push(job);
  }
  return map;
}

function buildRoleRejectionInsights(jobs, t) {
  const groups = groupJobsByNormalizedRole(jobs);
  const out = [];

  for (const { label, jobs: roleJobs } of groups.values()) {
    const total = roleJobs.length;
    if (total < t.rolePatternMinJobs) continue;

    const rejected = roleJobs.filter((j) => normalizeStatus(j?.status) === 'rejected').length;
    if (rejected < t.rolePatternMinRejections) continue;

    const rate = total > 0 ? rejected / total : 0;
    if (rate < t.rolePatternMinRejectionRate) continue;

    out.push({
      title: 'Role rejection pattern',
      message: `${label} applications show higher rejection frequency.`,
      _sortRate: rate,
    });
  }

  out.sort((a, b) => (b._sortRate || 0) - (a._sortRate || 0));
  return out.map(({ _sortRate, ...rest }) => rest);
}

export function generateJobInsightsThing(jobListDataThing) {
  const jobs = Array.isArray(jobListDataThing) ? jobListDataThing : [];

  const totalJobs = jobs.length;

  const appliedCount = jobs.filter((j) => normalizeStatus(j?.status) !== 'apply later').length;
  const interviewCount = jobs.filter((j) => normalizeStatus(j?.status) === 'interview').length;
  const rejectedCount = jobs.filter((j) => normalizeStatus(j?.status) === 'rejected').length;
  const applyLaterCount = jobs.filter((j) => normalizeStatus(j?.status) === 'apply later').length;

  const insightsArray = [];
  const t = INSIGHT_THRESHOLDS;

  if (appliedCount >= t.lowInterviewMinApplied) {
    const interviewRate = appliedCount > 0 ? interviewCount / appliedCount : 0;
    if (interviewRate < t.lowInterviewMaxRate) {
      insightsArray.push({
        title: 'Low Interview Rate',
        message: 'Interview conversion rate is low.',
      });
    }
  }

  if (rejectedCount >= t.highRejectionsMin) {
    insightsArray.push({
      title: 'High Rejections',
      message: 'High rejection count detected in recent applications.',
    });
  }

  if (applyLaterCount >= t.tooManyApplyLaterMin) {
    insightsArray.push({
      title: 'Too Many Apply Later',
      message: 'You have many jobs saved for later.',
    });
  }

  insightsArray.push(...buildRoleRejectionInsights(jobs, t));

  const smallMetricsThing = {
    totalJobs,
    totalInterviews: interviewCount,
    totalRejections: rejectedCount,
  };

  return {
    insightsArray,
    metricsThing: smallMetricsThing,
  };
}
