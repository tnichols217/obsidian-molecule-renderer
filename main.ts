import { Plugin, MarkdownRenderChild, MarkdownRenderer, PluginSettingTab, App, MarkdownPostProcessorContext, request } from 'obsidian';
import { SettingItem, display, loadSettings, saveSettings } from 'obsidian-settings/settings'

const NAME = "Obsidian Molecule Renderer"
const CODEBLOCK = "molecule"
const CODEBLOCK3D = "molecule3d"
export interface MoleculeRendererSettings {
	imageSize: SettingItem<number>
}

const DEFAULT_SETTINGS: MoleculeRendererSettings = {
	imageSize: {value: 500, name: "Image Size", desc: "Default image size"}
}

export default class ObsidianMoleculeRenderer extends Plugin {

	settings: MoleculeRendererSettings

	async getMolecule(src: string) {
		return new Promise<any>(async (resolve, reject) => {
			request({url: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + src + "/property/MolecularFormula/JSON"})
				.then(value => {
					resolve(JSON.parse(value))
				})
				.catch(reject)
			}
		)
	}

	async moleculeNotFound(src: string, el: HTMLElement) {
		let heading = el.createEl("h1")
		heading.innerText = "Chemical Not found"
		heading = el.createEl("h2")
		heading.innerText = "Similar Chemicals include:"
		request({url: "https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/" + src})
			.then(value => {
				let suggestions = JSON.parse(value)?.dictionary_terms?.compound
				let list = el.createEl("ol")
				console.log(suggestions)
				suggestions = suggestions ?? []
				for (let i of suggestions) {
					let item = list.createEl("li")
					item.innerText = i.toLowerCase()
				}
			})
			.catch(console.error)
	}
	
	async onload() {

		await this.loadSettings();
		this.addSettingTab(new ObsidianMoleculeRendererSettings(this.app, this));

		this.registerMarkdownCodeBlockProcessor(CODEBLOCK, async (src, el, ctx) => {
			this.getMolecule(src)
				.then(value => {
					if (!value || "Fault" in value) {
						this.moleculeNotFound(src, el)
					} else {
						let CID = value.PropertyTable.Properties[0].CID
						let img = el.createEl("img")
						img.src = "https://pubchem.ncbi.nlm.nih.gov/image/imagefly.cgi?cid=" + CID + `&width=${this.settings.imageSize.value.toString()}&height=${this.settings.imageSize.value.toString()}`
					}
				})
				.catch(_ => {
					this.moleculeNotFound(src, el)
				})
			
		})

		this.registerMarkdownCodeBlockProcessor(CODEBLOCK3D, async (src, el, ctx) => {
			this.getMolecule(src)
				.then(value => {
					if (!value || "Fault" in value) {
						this.moleculeNotFound(src, el)
					} else {
						let CID = value.PropertyTable.Properties[0].CID
						let container = el.createDiv()
						container.style.width = "100%"
						container.style.paddingTop = "100%"
						container.style.position = "relative"
						let iframe = container.createEl("iframe")
						iframe.src = "https://embed.molview.org/v1/?mode=balls&cid=" + CID
						iframe.style.width = "100%"
						iframe.style.height = "100%"
						iframe.style.position = "absolute"
						iframe.style.top = "0"
						iframe.style.border = "0"
					}
				})
				.catch(_ => {
					this.moleculeNotFound(src, el)
				})
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