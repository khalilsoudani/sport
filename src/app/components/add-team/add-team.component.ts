import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.component.html',
  styleUrls: ['./add-team.component.css']
})
export class AddTeamComponent implements OnInit {
  bannerDetails: any;
  addTeamForm: FormGroup;
  team: any = {};
  teamId: string;
  imagePreview:any;
  constructor(
    private formBuilder: FormBuilder,
    private teamService: TeamService,
    private activeRouter: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.teamId = this.activeRouter.snapshot.paramMap.get('id');
    this.addTeamForm = this.formBuilder.group({
      name: [""],
      foundation: [""],
      country: [""],
      stadium: [""],
      img: [""]
    })
    if (this.teamId != null) {
      this.bannerDetails = { title: "Edit Team" };
      this.teamService.sendReqToGetTeamById(this.teamId).subscribe((data) => {
        this.team = data.result
      })
    } else {
      this.bannerDetails = { title: "Add Team" };
    }
  }

  addOrEditTeam() {
    console.log('btn clicker', this.team)
    if (this.teamId != null) {
      this.teamService.sendReqToEditTeam(this.team).subscribe((data) => {
        alert(data.result);
        this.router.navigate(['admin'])
      })
    } else {
      this.teamService.sendReqToAddTeam(this.team, this.addTeamForm.value.img).subscribe((data) => {
        alert(data.message);
        this.router.navigate(['admin'])
      });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.addTeamForm.patchValue({ img: file });
    this.addTeamForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
    this.imagePreview = reader.result as string
    };
    reader.readAsDataURL(file);
    }
}
