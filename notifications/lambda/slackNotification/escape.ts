/**
 * Escape special characters
 * @see https://api.slack.com/reference/surfaces/formatting#escaping
 */
export const e = (str: string) =>
	str.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
