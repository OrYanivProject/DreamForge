/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[9],{584:function(xa,ta,h){function qa(ea){ea.Za();ea.advance();var ca=ea.current.textContent;ea.Jb();return ca}function oa(ea){var ca=[];for(ea.Za();ea.advance();){var ma=ea.pb();"field"===ma?ca.push(String(ea.ia("name"))):Object(b.j)("unrecognised field list element: ".concat(ma))}ea.Jb();return ca}function na(ea,ca){return ca?"false"!==ea:"true"===ea}function ja(ea,ca){var ma=ea.pb();switch(ma){case "javascript":return{name:"JavaScript",
javascript:ea.current.textContent};case "uri":return{name:"URI",uri:ea.ia("uri")};case "goto":ma=null;ea.Za();if(ea.advance()){var la=ea.ia("fit");ma={page:ea.ia("page"),fit:la};if("0"===ma.page)Object(b.j)("null page encountered in dest");else switch(ca=ca(Number(ma.page)),la){case "Fit":case "FitB":break;case "FitH":case "FitBH":ma.top=ca.Aa({x:0,y:ea.ia("top")||0}).y;break;case "FitV":case "FitBV":ma.left=ca.Aa({x:ea.ia("left")||0,y:0}).x;break;case "FitR":la=ca.Aa({x:ea.ia("left")||0,y:ea.ia("top")||
0});ca=ca.Aa({x:ea.ia("right")||0,y:ea.ia("bottom")||0});ca=new w.d(la.x,la.y,ca.x,ca.y);ma.top=ca.y1;ma.left=ca.x1;ma.bottom=ca.y2;ma.right=ca.x2;break;case "XYZ":la=ca.Aa({x:ea.ia("left")||0,y:ea.ia("top")||0});ma.top=la.y;ma.left=la.x;ma.zoom=ea.ia("zoom")||0;break;default:Object(b.j)("unknown dest fit: ".concat(la))}ma={name:"GoTo",dest:ma}}else Object(b.j)("missing dest in GoTo action");ea.Jb();return ma;case "submit-form":ma={name:"SubmitForm",url:ea.ia("url"),format:ea.ia("format"),method:ea.ia("method")||
"POST",exclude:na(ea.ia("exclude"),!1)};ca=ea.ia("flags");ma.flags=ca?ca.split(" "):[];for(ea.Za();ea.advance();)switch(ca=ea.pb(),ca){case "fields":ma.fields=oa(ea);break;default:Object(b.j)("unrecognised submit-form child: ".concat(ca))}ea.Jb();return ma;case "reset-form":ma={name:"ResetForm",exclude:na(ea.ia("exclude"),!1)};for(ea.Za();ea.advance();)switch(ca=ea.pb(),ca){case "fields":ma.fields=oa(ea);break;default:Object(b.j)("unrecognised reset-form child: ".concat(ca))}ea.Jb();return ma;case "hide":ma=
{name:"Hide",hide:na(ea.ia("hide"),!0)};for(ea.Za();ea.advance();)switch(ca=ea.pb(),ca){case "fields":ma.fields=oa(ea);break;default:Object(b.j)("unrecognised hide child: ".concat(ca))}ea.Jb();return ma;case "named":return{name:"Named",action:ea.ia("name")};default:Object(b.j)("Encountered unexpected action type: ".concat(ma))}return null}function ka(ea,ca,ma){var la={};for(ea.Za();ea.advance();){var ia=ea.pb();switch(ia){case "action":ia=ea.ia("trigger");if(ca?-1!==ca.indexOf(ia):1){la[ia]=[];for(ea.Za();ea.advance();){var ra=
ja(ea,ma);Object(a.isNull)(ra)||la[ia].push(ra)}ea.Jb()}else Object(b.j)("encountered unexpected trigger on field: ".concat(ia));break;default:Object(b.j)("encountered unknown action child: ".concat(ia))}}ea.Jb();return la}function fa(ea){return new y.a(ea.ia("r")||0,ea.ia("g")||0,ea.ia("b")||0,ea.ia("a")||1)}function x(ea,ca){var ma=ea.ia("name"),la=ea.ia("type")||"Type1",ia=ea.ia("size"),ra=ca.Aa({x:0,y:0});ia=ca.Aa({x:Number(ia),y:0});ca=ra.x-ia.x;ra=ra.y-ia.y;ma={name:ma,type:la,size:Math.sqrt(ca*
ca+ra*ra)||0,strokeColor:[0,0,0],fillColor:[0,0,0]};for(ea.Za();ea.advance();)switch(la=ea.pb(),la){case "stroke-color":ma.strokeColor=fa(ea);break;case "fill-color":ma.fillColor=fa(ea);break;default:Object(b.j)("unrecognised font child: ".concat(la))}ea.Jb();return ma}function z(ea){var ca=[];for(ea.Za();ea.advance();){var ma=ea.pb();switch(ma){case "option":ma=ca;var la=ma.push;var ia=ea;ia={value:ia.ia("value"),displayValue:ia.ia("display-value")||void 0};la.call(ma,ia);break;default:Object(b.j)("unrecognised options child: ".concat(ma))}}ea.Jb();
return ca}function r(ea,ca){var ma=ea.ia("name"),la={type:ea.ia("type"),quadding:ea.ia("quadding")||"Left-justified",maxLen:ea.ia("max-len")||-1},ia=ea.ia("flags");Object(a.isString)(ia)&&(la.flags=ia.split(" "));for(ea.Za();ea.advance();)switch(ia=ea.pb(),ia){case "actions":la.actions=ka(ea,["C","F","K","V"],function(){return ca});break;case "default-value":la.defaultValue=qa(ea);break;case "font":la.font=x(ea,ca);break;case "options":la.options=z(ea);break;default:Object(b.j)("unknown field child: ".concat(ia))}ea.Jb();
return new window.da.Annotations.la.xa(ma,la)}function n(ea,ca){switch(ea.type){case "Tx":try{if(Object(ha.c)(ea.actions))return new e.a.DatePickerWidgetAnnotation(ea,ca)}catch(ma){Object(b.j)(ma)}return new e.a.TextWidgetAnnotation(ea,ca);case "Ch":return ea.flags.get(aa.WidgetFlags.COMBO)?new e.a.ChoiceWidgetAnnotation(ea,ca):new e.a.ListWidgetAnnotation(ea,ca);case "Btn":return ea.flags.get(aa.WidgetFlags.PUSH_BUTTON)?new e.a.PushButtonWidgetAnnotation(ea,ca):ea.flags.get(aa.WidgetFlags.RADIO)?
new e.a.RadioButtonWidgetAnnotation(ea,ca):new e.a.CheckButtonWidgetAnnotation(ea,ca);case "Sig":return new e.a.SignatureWidgetAnnotation(ea,ca);default:Object(b.j)("Unrecognised field type: ".concat(ea.type))}return null}function f(ea,ca,ma,la){var ia=[],ra={};ea.Za();var pa=[],sa={},ua=[];Object(ba.a)(function(){if(ea.advance()){var wa=ea.pb();switch(wa){case "calculation-order":pa="calculation-order"===ea.pb()?oa(ea):[];break;case "document-actions":sa=ka(ea,["Init","Open"],ca);break;case "pages":wa=
[];for(ea.Za();ea.advance();){var Ba=ea.pb();switch(Ba){case "page":Ba=wa;var Ca=Ba.push,Aa=ea,Ja=ca,Ea={number:Aa.ia("number")};for(Aa.Za();Aa.advance();){var La=Aa.pb();switch(La){case "actions":Ea.actions=ka(Aa,["O","C"],Ja);break;default:Object(b.j)("unrecognised page child: ".concat(La))}}Aa.Jb();Ca.call(Ba,Ea);break;default:Object(b.j)("unrecognised page child: ".concat(Ba))}}ea.Jb();ua=wa;break;case "field":Ba=r(ea,ca(1));ra[Ba.name]=Ba;break;case "widget":wa={border:{style:"Solid",width:1},
backgroundColor:[],fieldName:ea.ia("field"),page:ea.ia("page"),index:ea.ia("index")||0,rotation:ea.ia("rotation")||0,flags:[],isImporting:!0};(Ba=ea.ia("appearance"))&&(wa.appearance=Ba);(Ba=ea.ia("flags"))&&(wa.flags=Ba.split(" "));for(ea.Za();ea.advance();)switch(Ba=ea.pb(),Ba){case "rect":Ca=ea;Aa=ca(Number(wa.page));Ba=Aa.Aa({x:Ca.ia("x1")||0,y:Ca.ia("y1")||0});Ca=Aa.Aa({x:Ca.ia("x2")||0,y:Ca.ia("y2")||0});Ba=new w.d(Ba.x,Ba.y,Ca.x,Ca.y);Ba.normalize();wa.rect={x1:Ba.x1,y1:Ba.y1,x2:Ba.x2,y2:Ba.y2};
break;case "border":Ba=ea;Ca={style:Ba.ia("style")||"Solid",width:Ba.ia("width")||1,color:[0,0,0]};for(Ba.Za();Ba.advance();)switch(Aa=Ba.pb(),Aa){case "color":Ca.color=fa(Ba);break;default:Object(b.j)("unrecognised border child: ".concat(Aa))}Ba.Jb();wa.border=Ca;break;case "background-color":wa.backgroundColor=fa(ea);break;case "actions":wa.actions=ka(ea,"E X D U Fo Bl PO PC PV PI".split(" "),ca);break;case "appearances":Ba=ea;Ca=Object(ha.b)(wa,"appearances");for(Ba.Za();Ba.advance();)if(Aa=Ba.pb(),
"appearance"===Aa){Aa=Ba.ia("name");Ja=Object(ha.b)(Ca,Aa);Aa=Ba;for(Aa.Za();Aa.advance();)switch(Ea=Aa.pb(),Ea){case "Normal":Object(ha.b)(Ja,"Normal").data=Aa.current.textContent;break;default:Object(b.j)("unexpected appearance state: ",Ea)}Aa.Jb()}else Object(b.j)("unexpected appearances child: ".concat(Aa));Ba.Jb();break;case "extra":Ba=ea;Ca=ca;Aa={};for(Ba.Za();Ba.advance();)switch(Ja=Ba.pb(),Ja){case "font":Aa.font=x(Ba,Ca(1));break;default:Object(b.j)("unrecognised extra child: ".concat(Ja))}Ba.Jb();
Ba=Aa;Ba.font&&(wa.font=Ba.font);break;case "captions":Ca=ea;Ba={};(Aa=Ca.ia("Normal"))&&(Ba.Normal=Aa);(Aa=Ca.ia("Rollover"))&&(Ba.Rollover=Aa);(Ca=Ca.ia("Down"))&&(Ba.Down=Ca);wa.captions=Ba;break;default:Object(b.j)("unrecognised widget child: ".concat(Ba))}ea.Jb();(Ba=ra[wa.fieldName])?(wa=n(Ba,wa),ia.push(wa)):Object(b.j)("ignoring widget with no corresponding field data: ".concat(wa.fieldName));break;default:Object(b.j)("Unknown element encountered in PDFInfo: ".concat(wa))}return!0}return!1},
function(){ea.Jb();ma({calculationOrder:pa,widgets:ia,fields:ra,documentActions:sa,pages:ua,custom:[]})},la)}h.r(ta);h.d(ta,"parse",function(){return f});var b=h(3),a=h(1);h.n(a);var e=h(150),w=h(4),y=h(9),ba=h(28),ha=h(132),aa=h(20)}}]);}).call(this || window)