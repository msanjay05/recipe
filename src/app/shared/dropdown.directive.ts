import { Directive, ElementRef, HostBinding, HostListener, OnInit } from "@angular/core";
@Directive({
    selector:'[appDropdown]'
})
export class DropdownDrirective implements OnInit{
    @HostBinding('class.open') isOpen=false
    @HostListener('click') ontoggle(event:Event){
        this.isOpen=!this.isOpen;
    }

    constructor(private elRef:ElementRef){}
    ngOnInit(): void {
        
    }
}