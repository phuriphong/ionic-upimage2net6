import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  slideOpts = {
  }
  constructor(private http: HttpClient){}

  setSlideOpt() {

    this.slideOpts = {
      initialSlide: 0,
      direction: 'horizontal',
      speed: 300,
      // effect: slide,
      spaceBetween: 8,
      slidesPerView: 3.5,
      freeMode: true,
      loop: false
    }
  }
    takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.webPath;
    // Can be set to the src of an image now
    this.imageElement.src = imageUrl;

  }
  imageElement:any ={}
  async sent(){
    let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmNGM0YzcyNC01ZTIyLTQxNzctYWZjNC1hZTU1NzUxZGEwYjAiLCJ2YWxpZCI6IjEiLCJFbXBsb3llZUlkIjoiMTEwMDUzMDEiLCJOaWNrTmFtZSI6IuC4m-C4suC4mSIsIkZpcnN0TmFtZSI6IuC4nuC4meC4oeC5gOC4l-C4teC4ouC4mSIsIkxhc3ROYW1lIjoi4Lia4Lix4Lin4LmE4Lie4LijIiwiUG9zaXRpb25JZCI6IjQ5NzciLCJQb3NpdGlvbklkMiI6IiIsIlBvc2l0aW9uSWQzIjoiIiwiUG9zaXRpb25JZDQiOiIiLCJQb3NpdGlvbklkNSI6IiIsIlBvc2l0aW9uSWQ2IjoiIiwiRW1wbG95ZWVMZXZlbCI6IjMiLCJTYWxlb2ZmaWNlSWQiOiIxMjAxNCIsIlpvbmVJZCI6IjE3IiwiUmVnaW9uSWQiOiIxIiwiQ29tcGFueUlkIjoiNDkiLCJleHAiOjE3MDA3MjA2OTYsImlzcyI6Imh0dHBzOi8vY3Ztcy5jdm0tY2VudGVyLmNvbS8iLCJhdWQiOiJodHRwczovL2N2bXMuY3ZtLWNlbnRlci5jb20vIn0.umDE8Zt0giI8DQVKMOtxXL8uFbDOTzY_bGYRKXuJLHk';
    let blob = await fetch(this.imageElement.src).then(r => r.blob());
    this.ImgUp(blob,'https://localhost:7139/api/App/SaveQR_Daily',token).subscribe(d=>alert('ok'))
  }
//   dataURLtoFile(dataurl: string, filename: string) {
//     let arr = dataurl.split(',');

//       let  mime = arr[0].match(/:(.*?);/)?[1]
//       ,bstr = atob(arr[1]),
//          n = bstr.length,
//          u8arr = new Uint8Array(n);
//     while (n--) {
//         u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, {type: mime});
// }
  dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  //Old Code
  //write the ArrayBuffer to a blob, and you're done
  //var bb = new BlobBuilder();
  //bb.append(ab);
  //return bb.getBlob(mimeString);

  //New Code
  return new Blob([ab], {type: mimeString});


}
  public ImgUp(data: any,url: any,token: string)
  {
    const httpOptions = {
      headers: new HttpHeaders(
          {
              'Authorization':'Bearer ' + token
          }
      )
  };
      var fd = new FormData();
      const formData: FormData = new FormData();
      formData.append('MileImage',data);
      formData.append('Lat','13');
      formData.append('Long','1000');
      formData.append('MileNumber','9000');
      return this.http.post<any>(url, formData, {
        headers:httpOptions.headers,
        reportProgress: true,
        responseType: 'json'
    },
    ).pipe(
        tap(
            (data) => {
                // 200, awesome!, no errors will trigger it.
            },
            () => {
                // error is here, but we can only call side things.
            },
        ),
        catchError(error => {
            console.error(error)
            return of([]);
        })
    );
}
}
