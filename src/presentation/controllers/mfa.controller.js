import * as mfaAppService from '../../application/services/mfa.service.js';
import ApiResponse from '../../application/utils/ApiResponse.js';

/**
 * @description Generate a new MFA secret for the logged-in user.
 * This is the first step of enabling MFA. The secret is stored but not yet active.
 * @route POST /api/mfa/generate
 * @access Private
 */
export const generateMfaSecret = async (req, res, next) => {
  try {
    // Delegate business logic to the MFA service
    const responseData = await mfaAppService.generateMfa(req.userLogin);

    ApiResponse.success(
      'MFA secret generated successfully.',
      responseData
    ).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * @description Verify the TOTP and enable MFA for the user.
 * This is the second step, where the user confirms they have correctly set up the secret.
 * @route POST /api/mfa/verify-setup
 * @access Private
 */
export const verifyAndEnableMfa = async (req, res, next) => {
  try {
    const userId = req.userLogin._id; // From 'protect' middleware
    const { token } = req.body;

    // Delegate business logic to the MFA service
    const result = await mfaAppService.verifyAndEnableMfa(userId, token);

    return ApiResponse.success(
      'MFA has been successfully enabled.',
      result
    ).send(res);
  } catch (error) {
    next(error);
  }
};

/**
 * @description Validate the TOTP for a user who is logging in.
 * This is used during the login flow after the user has entered their password.
 * @route POST /api/mfa/validate
 * @access Private (requires a temporary, pre-MFA auth token)
 */
export const validateMfaToken = async (req, res, next) => {
  try {
    const userId = req.userLogin._id; // From 'protect' middleware
    const { token } = req.body;

    // Delegate business logic to the MFA service
    const loginData = await mfaAppService.validateMfaToken(userId, token);

    ApiResponse.success('Login successful', loginData).send(res);
  } catch (error) {
    next(error);
  }
};
