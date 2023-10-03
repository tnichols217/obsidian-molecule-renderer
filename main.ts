import functionPlot from 'function-plot';
import { parse } from "yaml"
import { Plugin, MarkdownRenderChild, MarkdownRenderer, PluginSettingTab, App, MarkdownPostProcessorContext, request } from 'obsidian';
import { SettingItem, display, loadSettings, saveSettings } from 'obsidian-settings/settings'

const NAME = "Obsidian Function Plot"
const CODEBLOCK = "function-plot"
export interface FunctionPlotSettings {
	a: SettingItem<string>
}

const DEFAULT_SETTINGS: FunctionPlotSettings = {
	a: {value: "a", name: "a", desc: "a"}
}

export default class ObsidianFunctionPlot extends Plugin {

	settings: FunctionPlotSettings

	async onload() {

		await this.loadSettings();
		this.addSettingTab(new ObsidianFunctionPlotSettings(this.app, this));

		this.registerMarkdownCodeBlockProcessor(CODEBLOCK, async (src, el, ctx) => {
			let graph = el.createEl("div")
			let params = parse(src)
			Object.assign(params, { target: graph })
			functionPlot(params)
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

class ObsidianFunctionPlotSettings extends PluginSettingTab {
	plugin: ObsidianFunctionPlot;

	constructor(app: App, plugin: ObsidianFunctionPlot) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		display(this, DEFAULT_SETTINGS as any, NAME)
	}
}