// Container.ts
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

/// <reference path="Component.ts" />
/// <reference path="Constraint.ts" />
/// <reference path="EventCollector.ts" />
/// <reference path="LocationComparator.ts" />
/// <reference path="RenderContext.ts" />

namespace Framework.Graphics {
    export class Container extends Component {
        private children: Component[];
        private repaintingChildren: Component[];
        private needsFullRepaint: boolean;
        private focusedChild: Component;
        private registeredEvents: string[];
        private valid: boolean;
        private constraints: Constraint[];

        public getFocusedChild(): Component {
            return this.isFocused() ? this.focusedChild : null;
        }

        public setFocusedChild(child: Component) {
            let old: Component = this.getFocusedChild();
            if ( old != child ) {
                if ( old != null ) {
                    old.setFocused(false);
                }
                this.focusedChild = child;
                if ( child != null ) {
                    this.setFocused();
                }
                this.repaint();
            }
        }

        public paint(g: RenderContext) {
            for ( var i: number = 0; i < this.repaintingChildren.length; ++i ) {
                this.repaintingChildren[i].update(g.drawIn(this.repaintingChildren[i].getBounds()));
            }
            this.repaintingChildren = [];
        }

        public update(g: RenderContext) {
            if ( !this.isValid() ) {
                var done: boolean;
                do {
                    done = true;
                    for ( var i = 0; i < this.constraints.length; ++i ) {
                        done = this.constraints[i].tryConstrain() && done;
                    }
                } while ( !done );
                this.valid = true;
            }
            if ( this.needsFullRepaint ) {
                this.repaintingChildren = this.children;
                super.update(g);
            } else {
                this.paint(g);
            }
        }

        public repaintChild(child: Component) {
            if ( this.repaintingChildren.indexOf(child) < 0 ) {
                this.repaintingChildren.push(child);
                if ( this.repaintingChildren.length == 1 ) {
                    super.repaint();
                }
            }
        }

        public repaint() {
            this.needsFullRepaint = true;
            super.repaint();
        }

        public add(child: Component) {
            if ( this.children.indexOf(child) < 0 ) {
                this.children.push(child);
                child.setParent(this);
                this.invalidate();
            }
        }

        public remove(child: Component) {
            if ( this.children.indexOf(child) >= 0 ) {
                this.children = this.children.filter((v: Component) => v != child);
                this.constraints = this.constraints.filter((v: Constraint) => v.isRelatedTo(child));
                this.invalidate();
            }
        }

        public getChildren(): Component[] {
            return this.children;
        }

        public setBounds(bounds: Rectangle) {
            super.setBounds(bounds);
            this.invalidate();
        }

        public isValid() {
            return this.valid;
        }

        public invalidate() {
            this.valid = false;
            this.repaint();
        }

        public addConstraint(constraint: Constraint) {
            if ( !constraint.canBeConstrained(this) ) {
                throw new ConstrainingError("Constraint was added to wrong Container");
            }
            if ( this.constraints.indexOf(constraint) < 0 ) {
                this.constraints.push(constraint);
                this.invalidate();
            }
        }

        public removeConstraint(constraint: Constraint) {
            if ( this.constraints.indexOf(constraint) >= 0 ) {
                this.constraints = this.constraints.filter((v: Constraint) => v != constraint);
                this.invalidate();
            }
        }

        public initEvent(type: string, comparator: LocationComparator, collector: EventCollector, exclude?: Container): void {
            let parent: Container = this.getParent();
            if ( parent && parent != exclude ) {
                parent.initEvent(type, comparator, collector, this);
            }
            let children: Component[] = this.getChildren();
            for ( var i = 0; i < children.length; ++i ) {
                if ( children[i] != exclude && children[i] instanceof Container ) {
                    (children[i] as Container).initEvent(type, comparator, collector, this);
                }
            }
            if ( this.registeredEvents.indexOf(type) < 0 ) {
                this.addEventListener(type, (e: Event) => {
                    let children: Component[] = this.getChildren();
                    for ( var i = 0; i < children.length; ++i ) {
                        if ( comparator(e, children[i]) ) {
                            children[i].dispatchEvent(e);
                        }
                    }
                });
            }
        }

        public constructor() {
            super();
            this.children = [];
            this.repaintingChildren = [];
            this.needsFullRepaint = true;
            this.registeredEvents = [];
            this.constraints = [];
        }
    }
}
