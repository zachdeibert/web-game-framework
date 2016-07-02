// ModelList.ts
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

/// <reference path="ListEventType.ts" />
/// <reference path="ModelBase.ts" />
/// <reference path="ModelListEvent.ts" />

namespace Framework.Model {
    export class ModelList<T extends ModelBase> extends ModelBase {
        public length: number;
        public delete: number;
        private array: T[];
        private TClass: any;

        protected getFieldValue(key: string): any {
            if ( key.match(/\[(0|[1-9][0-9]*)\]/) ) {
                return this.array[parseInt(key.substr(1, key.length - 2))];
            } else {
                return super.getFieldValue(key);
            }
        }

        protected setFieldValue(key: string, val: any) {
            if ( key.match(/\[(0|[1-9][0-9]*)\]/) ) {
                this.array[parseInt(key.substr(1, key.length - 2))] = val;
            } else {
                super.setFieldValue(key, val);
            }
        }

        public load(json: any) {
            for ( var i: number = 0; i < json.array.length; ++i ) {
                this.array[i] = new this.TClass();
                this.array[i].load(json.array[i]);
            }
        }
        public get(i: number): T {
            return this.array[i];
        }

        public set(i: number, value: T) {
            let type: ListEventType = this.length <= i ? ListEventType.insert : ListEventType.set;
            this.array[i] = value;
            this.fieldChanged("[" + i + "]", value);
            this.dispatchEvent(new ModelListEvent(type, i, value));
        }

        public push(value: T): number {
            let i: number = this.length;
            this.set(i, value);
            return i;
        }

        public removeAt(i: number): T {
            let old: T = this.array.splice(i, 1)[0];
            this.fieldChanged("delete", i);
            this.dispatchEvent(new ModelListEvent(ListEventType.remove, i, old));
            return old;
        }

        public pop(): T {
            return this.removeAt(this.length - 1);
        }

        public remove(value: T): boolean {
            let i: number = this.array.indexOf(value);
            if ( i < 0 ) {
                return false;
            } else {
                this.removeAt(i);
                return true;
            }
        }

        public constructor(T: any) {
            super();
            this.array = [];
            this.TClass = T;
            Object.defineProperty(this, "length", {
                "enumerable": true,
                "get": () => this.array.length
            });
            Object.defineProperty(this, "delete", {
                "enumerable": true,
                "set": (i: number) => this.removeAt(i)
            });
        }
    }
}
