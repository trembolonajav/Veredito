import { getEditorialSnapshot } from "./store";
import { getPublicCardByContent } from "./selectorCore";
import type { ContentRecord } from "./types";

export function getNewsletterEditionRows(snapshot = getEditorialSnapshot()) {
  return [...snapshot.newsletterEditions]
    .sort(
      (a, b) =>
        new Date(b.sentAt ?? b.scheduledAt ?? "1970-01-01").getTime() -
        new Date(a.sentAt ?? a.scheduledAt ?? "1970-01-01").getTime()
    )
    .map((edition) => ({
      ...edition,
      headline: edition.headlineContentId
        ? getPublicCardByContent(
            snapshot.contents.find((item) => item.id === edition.headlineContentId) ?? snapshot.contents[0],
            snapshot
          )
        : undefined,
      items: edition.contentIds
        .map((id) => snapshot.contents.find((item) => item.id === id))
        .filter((item): item is ContentRecord => Boolean(item))
        .map((item) => getPublicCardByContent(item, snapshot)),
    }));
}

export function getNewsletterOperationalRows(snapshot = getEditorialSnapshot()) {
  const performanceById = new Map(snapshot.contentPerformance.map((item) => [item.contentId, item]));
  return getNewsletterEditionRows(snapshot).map((edition) => {
    const totals = edition.contentIds.reduce(
      (acc, contentId) => {
        const perf = performanceById.get(contentId);
        acc.views24h += perf?.views24h ?? 0;
        acc.newsletterClicks += perf?.newsletterClicks ?? 0;
        return acc;
      },
      { views24h: 0, newsletterClicks: 0 }
    );

    return {
      ...edition,
      totalViews24h: totals.views24h,
      totalNewsletterClicks: totals.newsletterClicks,
    };
  });
}
