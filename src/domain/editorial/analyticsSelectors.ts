import { getEditorialSnapshot } from "./store";
import { getPublishedContents, getPublicCardByContent, translateType } from "./selectorCore";

export function getAnalyticsOverview(snapshot = getEditorialSnapshot()) {
  const performanceById = new Map(snapshot.contentPerformance.map((item) => [item.contentId, item]));
  const published = getPublishedContents(snapshot);

  const topContents = published
    .map((content) => ({ content, perf: performanceById.get(content.id) }))
    .filter((item) => item.perf)
    .sort((a, b) => (b.perf?.views24h ?? 0) - (a.perf?.views24h ?? 0))
    .slice(0, 5)
    .map((item) => ({
      ...getPublicCardByContent(item.content, snapshot),
      views24h: item.perf?.views24h ?? 0,
      views7d: item.perf?.views7d ?? 0,
      views30d: item.perf?.views30d ?? 0,
    }));

  const byEditoria = Object.values(
    published.reduce<Record<string, { label: string; value: number }>>((acc, content) => {
      const card = getPublicCardByContent(content, snapshot);
      const perf = performanceById.get(content.id);
      acc[card.editoriaName] = acc[card.editoriaName] ?? { label: card.editoriaName, value: 0 };
      acc[card.editoriaName].value += perf?.views7d ?? 0;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const byType = Object.values(
    published.reduce<Record<string, { label: string; value: number }>>((acc, content) => {
      const label = translateType(content.type);
      const perf = performanceById.get(content.id);
      acc[label] = acc[label] ?? { label, value: 0 };
      acc[label].value += perf?.views7d ?? 0;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const byAuthor = Object.values(
    published.reduce<Record<string, { label: string; value: number }>>((acc, content) => {
      const card = getPublicCardByContent(content, snapshot);
      const perf = performanceById.get(content.id);
      acc[card.authorName] = acc[card.authorName] ?? { label: card.authorName, value: 0 };
      acc[card.authorName].value += perf?.views7d ?? 0;
      return acc;
    }, {})
  ).sort((a, b) => b.value - a.value);

  const totals = snapshot.contentPerformance.reduce(
    (acc, item) => {
      acc.homeClicks += item.homeClicks;
      acc.homeImpressions += item.homeImpressions;
      acc.newsletterClicks += item.newsletterClicks;
      return acc;
    },
    { homeClicks: 0, homeImpressions: 0, newsletterClicks: 0 }
  );

  return {
    topContents,
    byEditoria,
    byType,
    byAuthor,
    homeCtr: totals.homeImpressions ? Math.round((totals.homeClicks / totals.homeImpressions) * 1000) / 10 : 0,
    newsletterClicks: totals.newsletterClicks,
    urgentActive: snapshot.exposures.filter((item) => item.isUrgent).length,
  };
}
