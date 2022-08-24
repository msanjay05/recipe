import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { RecipesResolverService } from "./recipes/recipes.resolver.service";

@NgModule({
    providers:[
        RecipesResolverService,
        {provide:HTTP_INTERCEPTORS,useClass:AuthInterceptorService,multi:true}
    ]
})
export class CoreModule{}