import {Colors} from 'react-native-ui-lib';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ToastHandler} from './handler';

const DEFAULT_OPTIONS = {
  timeout: 2000,
};

const toast = new ToastHandler();

function showToast(message, options = {}) {
  return toast.showToast(message, {...DEFAULT_OPTIONS, ...options});
}

export function showGenericToast(message) {
  return showToast(message, {backgroundColor: Colors.primaryColor, icon: Icon.getImageSourceSync('check-circle-o')});
}

export function showSuccessToast(message) {
  return showToast(message, {backgroundColor: Colors.successColor, icon: Icon.getImageSourceSync('check-circle-o')});
}

export function showErrorToast(message) {
  return showToast(message, {backgroundColor: Colors.errorColor});
}
