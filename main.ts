import { Plugin, MarkdownRenderChild, MarkdownRenderer, PluginSettingTab, App, MarkdownPostProcessorContext, request } from 'obsidian';
import { SettingItem, display, loadSettings, saveSettings } from 'obsidian-settings/settings'
import * as SmilesDrawer from "smiles-drawer"

const NAME = "Obsidian Molecule Renderer"
const CODEBLOCK = "molecule"
// let smilesDrawer = new SmilesDrawer.SvgDrawer()

export interface MoleculeRendererSettings {
	a: SettingItem<string>
}

const DEFAULT_SETTINGS: MoleculeRendererSettings = {
	a: {value: "a", name: "a", desc: "a"}
}

interface colors {
	C: string,
	O: string,
	N: string,
	F: string,
	CL: string,
	BR: string,
	I: string,
	P: string,
	S: string,
	B: string,
	SI: string,
	H: string,
	BACKGROUND: string
}

export default class ObsidianMoleculeRenderer extends Plugin {

	settings: MoleculeRendererSettings
	
	async onload() {

		await this.loadSettings();
		this.addSettingTab(new ObsidianMoleculeRendererSettings(this.app, this));

		let colors: colors = {} as colors
		let updateColor = async () => {
			let s = getComputedStyle(document.body)
			colors.C = s.getPropertyValue("--text-normal")
			colors.O = s.getPropertyValue("--text-accent")
			colors.N = s.getPropertyValue("--text-selection").split(",").slice(0, 3).join(",") + ")"
			colors.F = s.getPropertyValue("--interactive-success")
			colors.CL = colors.F
			colors.BR = s.getPropertyValue("--text-error")
			colors.I = s.getPropertyValue("--interactive-accent")
			colors.P = colors.BR
			colors.S = s.getPropertyValue("--text-highlight-bg").split(",").slice(0, 3).join(",") + ")"
			colors.B = s.getPropertyValue("--text-error-hover")
			colors.SI = colors.B
			colors.H = s.getPropertyValue("--text-muted")
			colors.BACKGROUND = s.getPropertyValue("--background-primary")
		}
		updateColor()

		this.registerMarkdownCodeBlockProcessor(CODEBLOCK, async (src, el, ctx) => {
			let req = JSON.parse(await request({url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + src + "/property/IsomericSMILES/JSON"}))
			if ("Fault" in req) {
				let heading = el.createEl("h1")
				heading.innerText = "Chemical Not found"
				heading = el.createEl("h2")
				heading.innerText = "Similar Chemicals include:"
				let suggestions = JSON.parse(await request({url: "https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/" + src})).dictionary_terms.compound
				let list = el.createEl("ol")
				for (let i of suggestions) {
					let item = list.createEl("li")
					item.innerText = i.toLowerCase()
				}
			} else {
				let smiles = req.PropertyTable.Properties[0].IsomericSMILES
				let canvas = el.createEl("canvas" as unknown as keyof HTMLElementTagNameMap)
				canvas.style.width = "100%"
				let size = Math.round(parseFloat(getComputedStyle(canvas).width))
				let smilesDrawer = new SmilesDrawer.Drawer({
					width: size,
					height: size,
					themes: {
						light: colors
					}
				});
				SmilesDrawer.parse(smiles, (tree: any) => {
					smilesDrawer.draw(tree, canvas);
				}, (err: string) => {
					console.log(err);
				})
			}
		})
	}

	onunload() {

	}

	async loadSettings() {
		loadSettings(this, DEFAULT_SETTINGS)
	}

	async saveSettings() {
		await saveSettings(this, DEFAULT_SETTINGS)
	}
}

class ObsidianMoleculeRendererSettings extends PluginSettingTab {
	plugin: ObsidianMoleculeRenderer;

	constructor(app: App, plugin: ObsidianMoleculeRenderer) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		display(this, DEFAULT_SETTINGS, NAME)
	}
}