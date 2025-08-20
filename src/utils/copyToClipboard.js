export default function copyToClipboard(text)
{ if(!navigator.clipboard) return false; return navigator.clipboard.writeText(text) }