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
	
	var baseurl = document.location.protocol == 'file:' ? 'file:///' + document.location.pathname.substring(0, document.location.pathname.lastIndexOf("/")).substring(1) + '/' : document.location.href.substring(0, document.location.href.lastIndexOf("/")+1);
	var documentFilePath = parent.AscDesktopEditor.LocalFileGetSourcePath();
	var storage = null;
	var icon_style = 1;
	var hot_key = {};

    window.Asc.plugin.init = function() {
		document.body.classList.add(window.Asc.plugin.getEditorTheme());
		window.Asc.plugin.resizeWindow(310, 250, 310, 250, 500, 450);
		
		$('#ok').on('click', function(){window.Asc.plugin.button(0)});
		$('#cancel').on('click', function(){window.Asc.plugin.button(1)});
		
		var editor = parent.editor || parent.Asc.editor;
		if(editor){
			var macroText =  editor.pluginMethod_GetMacros();
			storage = new MacroLauncherStorage(documentFilePath);
			if(macroText){
				macroJSON = JSON.parse(macroText);
				macroArray = macroJSON.macrosArray;
				macroArray = macroArray.filter(el => !storage.getList().some(m => m.guid === el.guid));
				if(macroArray.length > 0 ) {
					macroArray.forEach( macro => {
						$('#macroList').append($('<option value="'+ macro.guid +'">'+ macro.name +'</option>'));
					});
					$('.select2').select2({dropdownParent: $('#body'), maximumSelectionLength: 3});
					for(var i = 1; i <= 43; i++) {
						var icon = $('<span class="icon"></div>');
						icon.attr('data-style', i);
						icon.css("background-image", "url('../resources/img/icons/icon"+ i +".svg')");
						icon.on('click', function(){ $('.icon').removeClass('selected'); $(this).addClass('selected'); icon_style = $(this).attr('data-style'); });
						$(".icons").append(icon);
					}
					$('.icon').first().click();
					$('#hotkey').on('click', function(){$(this).focus()});
					$('#hotkey').on('focus', function(){
						if($(this).children().length == 0)
							$(this).append($('<span class="stub">Нажмите комбинацию клавиш</span>'));
					});
					$('#hotkey').on('blur', function(){
						$(this).find('.stub').remove();
					});
					$('#hotkey').on('keyup', function(e){e.preventDefault(); return false;});
					$('#hotkey').on('keydown', function(e){
						if(!e.altKey && !e.ctrlKey && e.keyCode == 27)
							$('#clear').click();
						if((e.altKey || e.ctrlKey) && e.keyCode && e.keyCode != 17 && e.keyCode != 18) {
							$('#hotkey').empty();
							if(e.ctrlKey) {
								$('#hotkey').append($('<span class="key">Ctrl</span>'));
								$('#hotkey').append($('<span>+</span>'));
							}
							if(e.altKey) {
								$('#hotkey').append($('<span class="key">Alt</span>'));
								$('#hotkey').append($('<span>+</span>'));
							}
							$('#hotkey').append($('<span class="key">'+ getCharFromCode(e.keyCode) +'</span>'));
							hot_key.ctrl = e.ctrlKey;
							hot_key.alt = e.altKey;
							hot_key.key = e.keyCode;
							$('#clear').show();
						}
						e.preventDefault();
						return false;
					});
					$('#clear').on('click', function(){
						$('#hotkey').empty();
						hot_key = {};
						$(this).hide();
						$('#hotkey').focus();
					});
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
		if(id == 0) {
			storage.addMacro($('#macroList').val(), icon_style, hot_key);
		}
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
