type CampaignDesign = {
  campaignName: string;
  regions: { name: string; reason: string }[];
  audience: { segment: string; ageRange: string; interests: string[] }[];
  priceRanges: {
    channel: string;
    minBudget: number;
    maxBudget: number;
    description: string;
  }[];
  channels: { name: string; priority: string; reason: string }[];
  timeline: { phase: string; duration: string; actions: string[] }[];
  kpis: { metric: string; target: string }[];
};

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToGoogleAds(design: CampaignDesign) {
  const rows = [
    [
      'Campaign',
      'Ad Group',
      'Keyword',
      'Max CPC',
      'Location',
      'Audience Segment',
    ],
  ];

  for (const region of design.regions) {
    for (const aud of design.audience) {
      for (const interest of aud.interests) {
        const budget =
          design.priceRanges[0]?.minBudget ??
          design.priceRanges[0]?.maxBudget ??
          0;
        const dailyCpc = (budget / 30 / (design.regions.length * 10)).toFixed(
          2,
        );
        rows.push([
          design.campaignName,
          `${aud.segment} - ${region.name}`,
          interest,
          dailyCpc,
          region.name,
          `${aud.segment} (${aud.ageRange})`,
        ]);
      }
    }
  }

  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  downloadFile(
    csv,
    `${design.campaignName.replace(/\s+/g, '_')}_google_ads.csv`,
    'text/csv',
  );
}

export function exportToMetaAds(design: CampaignDesign) {
  const adSets = design.audience.map((aud, i) => ({
    ad_set_name: `${design.campaignName} - ${aud.segment}`,
    targeting: {
      age_min: parseInt(aud.ageRange.split('-')[0]) || 18,
      age_max: parseInt(aud.ageRange.split('-')[1]) || 65,
      interests: aud.interests,
      geo_locations: design.regions.map((r) => r.name),
    },
    daily_budget:
      ((design.priceRanges[i] ?? design.priceRanges[0])?.minBudget ?? 100) / 30,
    optimization_goal: 'LINK_CLICKS',
    billing_event: 'IMPRESSIONS',
    status: 'PAUSED',
  }));

  const exported = {
    campaign_name: design.campaignName,
    objective: 'OUTCOME_TRAFFIC',
    special_ad_categories: [],
    ad_sets: adSets,
    notes: {
      channels: design.channels.map((c) => ({
        name: c.name,
        priority: c.priority,
      })),
      kpis: design.kpis,
      timeline: design.timeline,
    },
  };

  downloadFile(
    JSON.stringify(exported, null, 2),
    `${design.campaignName.replace(/\s+/g, '_')}_meta_ads.json`,
    'application/json',
  );
}

export function exportToTikTokAds(design: CampaignDesign) {
  const adGroups = design.audience.map((aud, i) => ({
    adgroup_name: `${design.campaignName} - ${aud.segment}`,
    placement_type: 'AUTOMATIC',
    audience: {
      age_groups: [aud.ageRange],
      interests: aud.interests,
      locations: design.regions.map((r) => r.name),
    },
    budget: (design.priceRanges[i] ?? design.priceRanges[0])?.minBudget ?? 100,
    budget_mode: 'BUDGET_MODE_TOTAL',
    optimization_goal: 'CLICK',
    bid_type: 'BID_TYPE_NO_BID',
    schedule_type: 'SCHEDULE_FROM_NOW',
  }));

  const exported = {
    campaign_name: design.campaignName,
    campaign_type: 'REGULAR_CAMPAIGN',
    objective_type: 'TRAFFIC',
    budget_optimize_on: true,
    ad_groups: adGroups,
    strategy_notes: {
      timeline: design.timeline,
      kpis: design.kpis,
      regions_rationale: design.regions.map((r) => ({
        region: r.name,
        reason: r.reason,
      })),
    },
  };

  downloadFile(
    JSON.stringify(exported, null, 2),
    `${design.campaignName.replace(/\s+/g, '_')}_tiktok_ads.json`,
    'application/json',
  );
}

export function exportToLinkedInAds(design: CampaignDesign) {
  const rows = [
    [
      'Campaign Name',
      'Campaign Group',
      'Audience Name',
      'Locations',
      'Age Range',
      'Interests/Skills',
      'Daily Budget',
      'Objective',
    ],
  ];

  for (const aud of design.audience) {
    const budget =
      design.priceRanges.find((p) =>
        p.channel.toLowerCase().includes('linkedin'),
      ) ?? design.priceRanges[0];
    rows.push([
      design.campaignName,
      aud.segment,
      `${aud.segment} (${aud.ageRange})`,
      design.regions.map((r) => r.name).join('; '),
      aud.ageRange,
      aud.interests.join('; '),
      ((budget?.minBudget ?? 100) / 30).toFixed(2),
      'Website visits',
    ]);
  }

  const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  downloadFile(
    csv,
    `${design.campaignName.replace(/\s+/g, '_')}_linkedin_ads.csv`,
    'text/csv',
  );
}
