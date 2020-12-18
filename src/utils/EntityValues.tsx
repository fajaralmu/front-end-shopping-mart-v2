import React from 'react';
import EntityProperty from '../models/EntityProperty';
import EntityElement from '../models/EntityElement';
import { FIELD_TYPE_DYNAMIC_LIST, FIELD_TYPE_FIXED_LIST, FIELD_TYPE_DATE, FIELD_TYPE_IMAGE } from '../constant/FieldTypes';
import { baseImageUrl } from '../constant/Url';
export default class EntityValues {
	static parseValues(object:any, prop:EntityProperty) : Array<any> {
		const result = new Array();
		const elemnents:EntityElement[] =prop.elements;
		for (let i = 0; i < elemnents.length; i++) {
			const element = elemnents[i];
			const elementid = element.id;
			let value:any =  object[elementid];
			if (value == null) {
				result.push(value);
				continue;
			}
			switch(element.type) {
				case FIELD_TYPE_DYNAMIC_LIST:
				case FIELD_TYPE_FIXED_LIST:
					const valueAsObj = object[elementid];
					value = valueAsObj[element.optionItemName??"id"];
					break;
				case FIELD_TYPE_DATE:
					value = new Date(value).toString();
					break;
				case FIELD_TYPE_IMAGE:
					const imgLink = new String(value).split("~")[0];
					value = <img src ={baseImageUrl+imgLink} width="50" height="50"/>
					break;
				default:
					value = object[elementid];
			}
			result.push(value);
		}
		return result;
	}
}