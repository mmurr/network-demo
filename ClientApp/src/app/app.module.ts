import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list"
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
// import { MatAutocomplete } from "@angular/material/autocomplete"
// import { MatPaginatorModule } from "@angular/material/paginator"
// import { MatDividerModule } from "@angular/material/divider"
import { MatSliderModule } from "@angular/material/slider"
import { NavMenuComponent } from "./nav-menu/nav-menu.component";
import { NetworkUIComponent } from "./network-ui/network-ui.component";
import { NetworkGraphComponent } from "./network-graph/network-graph.component";
import { SearchComponent } from "./search/search.component";
import { SearchResultsComponent } from "./search-results/search-results.component";
import { SearchTermsComponent } from "./search-terms/search-terms.component";
import { SearchResultComponent } from "./search-result/search-result.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    NetworkGraphComponent,
    NetworkUIComponent,
    SearchComponent,
    SearchResultsComponent,
    SearchTermsComponent,
    SearchResultComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: "ng-cli-universal" }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatCheckboxModule,
    MatSliderModule,
    //MatAutocomplete,
    // MatDividerModule,
    // MatPaginatorModule,
    FormsModule
  ],
  providers: [ ],
  bootstrap: [AppComponent],
})
export class AppModule {}
