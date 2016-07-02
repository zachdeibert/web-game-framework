// ModelBase.ts
//
// Copyright (c) 2016 Zach Deibert
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/// <reference path="../EventDispatcher.ts" />
/// <reference path="ModelChangeEvent.ts" />
/// <reference path="ModelProperty.ts" />

namespace Framework.Model {
    import EventDispatcher = Framework.EventDispatcher;

    export abstract class ModelBase extends EventDispatcher {
        private parent: ModelBase;
        private parentName: string;

        protected getFieldValue(key: string): any {
            return (this as any)[key];
        }

        protected setFieldValue(key: string, val: any) {
            (this as any)[key] = val;
        }

        public setField(key: string, val: any) {
            let i: number = key.indexOf('.');
            if ( i < 0 ) {
                let field: any = this.getFieldValue(key);
                if ( field && field instanceof ModelBase ) {
                    field.load(val);
                } else {
                    this.setFieldValue(key, val);
                    this.initField(val, key);
                }
                this.fieldChanged(key, val);
            } else {
                let sub: ModelBase = this.getFieldValue(key.substr(0, i));
                sub.setField(key.substr(i + 1), val);
            }
        }

        public load(json: any) {
            let me: any = this;
            for ( var key in json ) {
                if ( this.hasOwnProperty(key) ) {
                    if ( me[key] instanceof ModelBase ) {
                        me[key].load(json[key]);
                    } else {
                        me[key] = json[key];
                    }
                }
            }
        }

        public savableObject(): any {
            let o: any = {};
            let me: any = this;
            for ( var key in this ) {
                if ( typeof(me[key]) != "function" && key != "listeners" && key != "listenerObjects" && key != "parent" && key != "parentName" ) {
                    if ( me[key] instanceof ModelBase ) {
                        o[key] = me[key].savableObject();
                    } else {
                        o[key] = me[key];
                    }
                }
            }
            return o;
        }

        public save(): string {
            return JSON.stringify(this.savableObject());
        }

        protected fieldChanged(path: string, val: any = (this as any)[path]) {
            this.dispatchEvent(new ModelChangeEvent(path, val));
            if ( this.parent != null ) {
                this.parent.fieldChanged(this.parentName + "." + path, val);
            }
        }

        protected initField(value: any, key: string) {
            if ( value instanceof ModelBase ) {
                value.parent = this;
                value.parentName = key;
            }
        }

        protected registerGetttersAndSetters() {
            let me: any = this;
            for ( var key in this ) {
                var val: any = me[key];
                if ( typeof(val) != "function" && key != "listeners" && key != "listenerObjects" && key != "parent" && key != "parentName" ) {
                    Object.defineProperty(this, key, new ModelProperty(key, val, (v: any, k: string) => {
                        this.initField(v, k);
                        this.fieldChanged(k);
                    }) as any);
                }
            }
        }
    }
}
