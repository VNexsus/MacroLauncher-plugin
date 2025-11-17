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
	let documentFilePath = parent.AscDesktopEditor.LocalFileGetSourcePath();
	let storage = null;

    window.Asc.plugin.init = function() {
		document.body.classList.add(window.Asc.plugin.getEditorTheme());
		
		$('#ok').on('click', function(){window.Asc.plugin.button(0)});
		$('#cancel').on('click', function(){window.Asc.plugin.button(1)});
		
		var editor = parent.editor || parent.Asc.editor;
		if(editor){
			var macroText =  editor.pluginMethod_GetMacros();
			storage = new MacroLauncherStorage(documentFilePath);
			if(macroText){
				macroJSON = JSON.parse(macroText);
				macroArray = macroJSON.macrosArray;
				macroArray = macroArray.filter(el => !storage.getList().includes(el.guid));
				if(macroArray.length > 0 ) {
					macroArray.forEach( macro => {
						$('#macroList').append($('<option value="'+ macro.guid +'">'+ macro.name +'</option>'));
					});
					$('.select2').select2({dropdownParent: $('#body'), maximumSelectionLength: 3});
				}
				else
					window.Asc.plugin.noMacro();
			}
			else
				window.Asc.plugin.noMacro();
		}
		else
			window.Asc.plugin.button(-1);
	}

	window.Asc.plugin.noMacro = function() {
		$('#ok').prop('disabled', true);
		$('#body').html('<div class="stub">Документ не содержит макросов или все макросы уже были добавлены</div>');
	}

	window.Asc.plugin.button = function(id) {
		if(id == 0)
			storage.addMacro($('#macroList').val());
		this.executeCommand("close", "");
	}

	window.Asc.plugin.onThemeChanged = function(theme) {
		window.Asc.plugin.onThemeChangedBase(theme);
		document.body.classList.remove("theme-dark", "theme-light");
		document.body.classList.add(window.Asc.plugin.getEditorTheme());
	}

	window.Asc.plugin.getEditorTheme = function(){
		if(window.localStorage && window.localStorage.getItem("ui-theme")){
			var x = JSON.parse(window.localStorage.getItem("ui-theme"));
			return 'theme-' + x.type;
		}
		return "theme-light";
	}

})(window, undefined);
