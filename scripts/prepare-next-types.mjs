import { writeFile } from 'node:fs/promises';

const content = `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Ovu datoteku generiše provjera jer je next-env.d.ts namjerno izuzet iz Git repozitorija.
`;

await writeFile('next-env.d.ts', content, 'utf8');
