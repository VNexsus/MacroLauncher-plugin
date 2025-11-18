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

class MacroLauncherStorage {

	constructor(documentPath) {
		this.storageKey = "MacroLauncher-plugin";
		this.data = {};
		this.documentPath = documentPath;
		
		if(window.localStorage && typeof(window.localStorage.getItem)){
			var data = window.localStorage.getItem(this.storageKey);
			if(data)
				this.data = JSON.parse(data);
		}
	}
	
	getList() {
		return this.data[this.documentPath] || [];
	}
	
	addMacro(id, style, hotkey) {
		var macroList = this.data[this.documentPath];
		if(macroList) 
			macroList.push({guid: id, style: style, hotkey: hotkey});
		else
			this.data[this.documentPath] = [{guid: id, style: style, hotkey: hotkey}];
		this.save();
	}
	
	removeMacro(id) {
		var macroList = this.data[this.documentPath] || [];
		this.data[this.documentPath] = macroList.filter(el => el.guid !== id), this.save();
	}
	
	save(){
		window.localStorage.setItem(this.storageKey, JSON.stringify(this.data))
	}

}