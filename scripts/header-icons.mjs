const paths={
 home:'<path d="m3 11 9-8 9 8M5.5 9.5V21H10v-7h4v7h4.5V9.5"/>',
 book:'<path d="M12 5.5C8.5 3.5 5 3 2 4.5V20c3-1.5 6.5-1 10 1 3.5-2 7-2.5 10-1V4.5c-3-1.5-6.5-1-10 1Zm0 0V21"/>',
 people:'<path d="M8.5 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7-7.5a3.5 3.5 0 0 1 0 7M2 21v-3a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v3Zm15-7.5a5 5 0 0 1 5 5V21h-4"/>',
 image:'<rect x="2.5" y="3" width="19" height="18" rx="2"/><circle cx="8" cy="8.5" r="1.5"/><path d="m3 17 5-5 4 4 3-3 6 6"/>',
 mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/>',
 support:'<path d="M12 11C7 8 6 5 8 3.5s4-.5 4 1c0-1.5 2-2.5 4-1s1 4.5-4 7.5ZM2 18l4-3 5 1.5c2 .5 2.5 3 0 3H8m4-3 6-3c3-1.5 5 1 2 3l-7 5H6l-4-2"/>',
 search:'<circle cx="10.5" cy="10.5" r="7"/><path d="m16 16 5 5"/>',
 chevron:'<path d="m6 9 6 6 6-6"/>'
};
export const headerIcon=name=>`<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||''}</svg>`;
