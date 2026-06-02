
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export const errorHandler = (error: HttpErrorResponse) => {

    return throwError(error.error);
}