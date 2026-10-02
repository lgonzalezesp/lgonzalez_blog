import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import astroConfig from '../../../astro.config.mjs';
import pkg from '../../../package.json' with { type: 'json' };
import { SITE_DESCRIPTION, SITE_TITLE } from '../../../src/consts';

describe('configuración del sitio', () => {
	it('usa el dominio definitivo como site', () => {
		expect(astroConfig.site).toBe('https://lgonzalez.dev');
	});

	it('tiene título y descripción propios (no los de la plantilla)', () => {
		expect(SITE_TITLE).not.toBe('Astro Blog');
		expect(SITE_DESCRIPTION).not.toBe('Welcome to my website!');
	});
});

describe('npm y Node', () => {
	it('fija la versión LTS de Node en .nvmrc', () => {
		expect(readFileSync('.nvmrc', 'utf8').trim()).toBe('24');
	});

	it('declara engines compatibles con la versión de .nvmrc', () => {
		expect(pkg.engines.node).toContain('^24.0.0');
		expect(pkg.engines.npm).toBeDefined();
	});

	it('define todos los scripts acordados', () => {
		for (const script of [
			'dev',
			'build',
			'preview',
			'check',
			'lint',
			'format',
			'format:check',
			'test:unit',
			'test:e2e',
			'test',
		]) {
			expect(pkg.scripts, `falta el script "${script}"`).toHaveProperty(script);
		}
	});
});
