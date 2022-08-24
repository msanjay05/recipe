import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDrirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceHolderDirective } from "./placeholder/placeholder.directive";

@NgModule({
    declarations:[
        DropdownDrirective,
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceHolderDirective
    ],
    imports:[
        CommonModule
    ],
    exports:[
        DropdownDrirective,
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceHolderDirective,
        CommonModule
    ],
    // providers:[LoggingService]
})
export class SharedModule{}