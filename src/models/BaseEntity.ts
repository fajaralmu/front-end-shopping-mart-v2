
import React from 'react'
import HeaderProps from './HeaderProps';
import EntityProperty from './EntityProperty';
import EntityElement from './EntityElement';
import { FIELD_TYPE_DYNAMIC_LIST, FIELD_TYPE_FIXED_LIST, FIELD_TYPE_DATE, FIELD_TYPE_IMAGE } from '../constant/FieldTypes';
export default class BaseEntity{
	id?:number;
	createdDate?:Date;
	modifiedDate?:Date;
	deletedDate?:Date;
	deleted?:boolean;

}
