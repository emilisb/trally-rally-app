import {QuestionType} from '../constants';

export function getQuestionType(type) {
  switch (type) {
    case QuestionType.PHOTO:
      return 'Foto klausimas';
    case QuestionType.INPUT:
      return 'Atviras klausimas';
    case QuestionType.QR:
      return 'QR kodas';
  }
}

export function getSubmissionStatus(status) {
  return status ? 'Atsakytas' : 'Nepateiktas';
}
