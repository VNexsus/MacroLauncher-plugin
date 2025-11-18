/**
 *
 * (c) Copyright VNexsus 2025
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function(window, undefined){
	
	let baseurl = document.location.protocol == 'file:' ? 'file:///' + document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")).substring(1) + '/' : document.location.href.substring(0, document.location.href.lastIndexOf("/")+1);
	let documentFilePath = null;
	let storage = null;

    window.Asc.plugin.init = function() {}

	window.Asc.plugin.event_onDocumentContentReady = function() {
		var tlb = window.parent.DE || window.parent.PE || window.parent.SSE;
		var editor = parent.editor || parent.Asc.editor;
		if (tlb && editor) {
			// detach hotkey check
			parent.document.removeEventListener('keydown', window.Asc.plugin.checkHotkey, true);
			var tab = $(parent.document).find('.ribtab[data-layout-name="toolbar-macro-launcher"]');
			if(tab.length == 0){
				tab = $(`
						<li class="ribtab" style="" data-layout-name="toolbar-macro-launcher">
							<a data-tab="macro-launcher" data-title="`+ window.Asc.plugin.name +`">`+ window.Asc.plugin.name +`</a>
						</li>
				`);
				window.parent.$("section.tabs ul").append(tab);
				tlb.controllers.Toolbar.toolbar.$tabs = parent.$('.ribtab');
			}
			
			var panel = $(parent.document).find('.panel[data-tab="macro-launcher"]');
			if(panel.length == 0){
				panel = $(`<section class="panel" data-tab="macro-launcher" id="macro-launcher-panel"></section>`);
				// Create Add launcher button
				let group = $(`<div class="group"></div>`);
				let btn = $(`<div id="btn-add-macro-launch"></div>`);
				group.append(btn);
				panel.append(group);
				new parent.Common.UI.Button({
					cls: "btn-toolbar x-huge icon-top",
					iconCls: "btn-add-macro-launch",
					disabled: false,
					dataHint: "0",
					caption: "Добавить макрос"
				}).render(panel.find('#btn-add-macro-launch')).on("click", function(){window.Asc.plugin.addMacroLaunch()});
				
				var styles = `
					.btn-add-macro-launch {background-image: url('`+ baseurl + `resources/img/add.svg')!important; background-size: contain!important;}
				`;
				for(var i = 1; i <= 43; i++) 
					styles += `
						.btn-macro-launch-`+ i +` {background-image: url('`+ baseurl + `resources/img/icons/icon`+ i +`.svg')!important; background-size: contain!important;}
					`;
				window.parent.$("section.box-panels").append(panel);
				tlb.controllers.Toolbar.toolbar.$panels = parent.$('.panel');
				panel.append(`<style>`+ styles +`</style>`);
			}
			
			documentFilePath = parent.AscDesktopEditor.LocalFileGetSourcePath();
			if(storage)
				delete storage;
			storage = new MacroLauncherStorage(documentFilePath);
			var macroText = editor.pluginMethod_GetMacros();
			if(macroText){
				macroJSON = JSON.parse(macroText);
				macroArray = macroJSON.macrosArray;
				macroArray = macroArray.filter(el => storage.getList().some(m => m.guid === el.guid));
				if(macroArray.length > 0 ) {
					group = panel.find('#macro-launch-group');
					if(group.length == 0){
						group = $(`<div class="group" id="macro-launch-group"></div>`);
						panel.append(`<div class="separator long"></div>`);
						panel.append(group);
					}
					else
						group.empty();
					macroArray.forEach( macro => {
						var sm = storage.getList().find(el => el.guid === macro.guid);
						btn = $(`<span id="btn-macro-launch-`+ macro.guid +`"></span>`);
						group.append(btn);
						var m = new parent.Common.UI.Menu({items: [{caption: "Выполнить макрос", value: "run"},{caption: "Удалить из панели", value: "remove"}]});
						m.on("item:click", function(menu,item){
							if(item.value == 'run')
								window.Asc.plugin.runMacro(macro.guid)
							if(item.value == 'remove')
								window.Asc.plugin.removeMacro(macro.guid)
						});
						new parent.Common.UI.Button({
							cls: "btn-toolbar x-huge icon-top",
							iconCls: "btn-macro-launch-"+ (sm.style || 1) ,
							disabled: false,
							hint: macro.name + (sm.hotkey && Object.keys(sm.hotkey).length > 0 ? (' (' + (sm.hotkey.ctrl ? 'Ctrl+' : '') + (sm.hotkey.alt ? 'Alt+' : '') + getCharFromCode(sm.hotkey.key) + ')') : ''),
							caption: macro.name,
							split: true,
							menu: m
						})
						.render(panel.find('#btn-macro-launch-'+ macro.guid))
						.on("click", function(){window.Asc.plugin.runMacro(macro.guid)});
					});
					// attach hotkeys
					parent.document.addEventListener('keydown', window.Asc.plugin.checkHotkey, true);
				}
			}
		}
	}

	window.Asc.plugin.checkHotkey = function(evt) {
		if(storage && (evt.ctrlKey ||  evt.altKey)) {
			var sm = storage.getList().find(el => (el.hotkey && el.hotkey.ctrl == evt.ctrlKey && el.hotkey.alt == evt.altKey && el.hotkey.key === evt.keyCode))
			if(sm) window.Asc.plugin.runMacro(sm.guid)
		}
	}
	
	window.Asc.plugin.addMacroLaunch = function(){
		var v = new parent.Asc.CPluginVariation();
		v.deserialize({
			url: 'dialog/dialog.html',
			isViewer: false,
			isVisual: true,
			isModal: true,
			EditorsSupport: ['word','cell','slide'],
			buttons: [],
			size: [ 310, 250 ]
		});
		var p = new parent.Asc.CPlugin();
		p.set_Guid('asc.{-1}');
		p.set_BaseUrl(baseurl);
		p.set_Name('Назначить макрос');
		p.set_Variations([v]);
		parent.Asc.editor.asc_pluginsRegister(baseurl, [p]);
		parent.Asc.editor.asc_pluginRun('asc.{-1}', 0);
		var target = parent.document.getElementById("iframe_asc.{-1}");
		target.focus();
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				var nodes = Array.from(mutation.removedNodes);
				var directMatch = nodes.indexOf(target) > -1
				var parentMatch = nodes.some(parent => parent.contains(target));
				if (directMatch || parentMatch) {
					if(parent.AscDesktopEditor)
						parent.Asc.editor.pluginMethod_RemovePlugin('asc.{-1}');
					else
						parent.Asc.editor.asc_pluginStop('asc.{-1}');
					window.Asc.plugin.event_onDocumentContentReady();
				}
			});
		});
		observer.observe(parent.document.body, {subtree: true, childList: true});
	}

	window.Asc.plugin.runMacro = function(guid) {
		var editor = parent.editor || parent.Asc.editor;
		if (editor) {
			var macroText = editor.pluginMethod_GetMacros();
			if(macroText){
				macroJSON = JSON.parse(macroText);
				macroArray = macroJSON.macrosArray;
				macroArray.find(macro => {
					if(macro.guid == guid){
						window.Asc.plugin.executeCommand("command", macro.value);
						return true;
					}
				});
			}
		}
	}
	
	window.Asc.plugin.removeMacro = function(guid) {
		$(parent.document).find('#btn-macro-launch-'+ guid).remove();
		storage && storage.removeMacro(guid);
	}

})(window, undefined);
