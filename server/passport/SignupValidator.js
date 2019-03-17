const PasswordValidator = require('password-validator');

class SignupValidator {
  static validate({ username, password }) {
    const result = {
      valid: false,
      message: '',
    };

    const passwordRules = new PasswordValidator();
    const usernameRules = new PasswordValidator();

    // Username rules
    usernameRules
      .is().min(6) // Minimum length 6
      .is().max(100) // Maximum length 100
      .has().not().spaces(); // Should not have spaces

    // Password rules
    passwordRules
      .is().min(8) // Minimum length 8
      .is().max(100) // Maximum length 100
      .has().not().spaces() // Should not have spaces
      .has().uppercase() // Must have uppercase letters
      .has().lowercase() // Must have lowercase letters
      .has().digits() // Must have digits
      .is().not().oneOf([ 'Passw0rd', 'Password123' ]); // Blacklist these values

    const usernameValidatorMessageMap = {
      min: 'Username must be 6 characters or more.',
      max: 'Username must be 100 characters or less.',
      spaces: 'Username cannot contain spaces.',
    };

    const passwordValidatorMessageMap = {
      min: 'Password must be 8 characters or more.',
      max: 'Password must be 100 characters or less.',
      spaces: 'Password cannot contain spaces.',
      uppercase: 'Password must contain uppercase letters.',
      lowercase: 'Password must contain lowercase letters.',
      digits: 'Password must contain at least 1 digit.',
      oneOf: 'Password is too simple.',
    };

    // If either of the validation fails, choose the first reason for message
    if (username === password) {
      result.message = 'Username and password cannot be the same.';
    } else if (!usernameRules.validate(username)) {
      const reasons = usernameRules.validate(username, { list: true });
      result.message = usernameValidatorMessageMap[reasons[0]];
    } else if (!passwordRules.validate(password)) {
      const reasons = passwordRules.validate(password, { list: true });
      result.message = passwordValidatorMessageMap[reasons[0]];
    } else {
      result.valid = true;
    }

    return result;
  }
}

module.exports = { SignupValidator };
