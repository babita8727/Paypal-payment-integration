const { AUTH_MODEL } = require("../model/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CONST = require("../../../middleware/constant").CONST;
const responseMessage = require("../../../middleware/responseMessage");

/*For access dotenv file*/
const dotenv = require("dotenv");
dotenv.config();

/*For storing image in local storage*/
const fs = require("fs");
const multer = require("multer");
const dir = "./uploads/profileImg";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).fields([{ name: "profileImg" }]);

const auth = {};

/**
 * REGISTRATION API
 */
auth.register = async (req, res, next) => {
  try {
    const data = req.body;

    const isExist = await AUTH_MODEL.findOne({ email: data.email });
    if (isExist) {
      res.status(400).send({
        success: false,
        message: responseMessage.ALREADY_EXIST,
      });
    } else {
      const hash = await bcrypt.hash(
        data.password,
        parseInt(process.env.SOLT_ROUND)
      );
      data.password = hash;

      const saveData = await AUTH_MODEL.create(data);
      if (saveData) {
        res.status(200).send({
          success: true,
          message: responseMessage.SIGNUP_SUCCESS,
          data: userData,
        });
      } else {
        res.status(400).send({
          success: false,
          message: responseMessage.SIGNUP_FAILE,
        });
      }
    }
  } catch (error) {
    console.log("error", error.message);
  }
};

/**
 * LOGIN API
 */
auth.login = async (req, res, next) => {
  try {
    const data = req.body;
    const findUser = await AUTH_MODEL.findOne({ email: data.email });
    if (findUser) {
      const comparePass = await bcrypt.compare(
        data.password,
        findUser.password
      );
      if (comparePass) {
        if (findUser.otpVerify !== CONST.YES) {
          return res.status(402).send({
            success: false,
            message: responseMessage.VERIFY_OTP_MESSAGE,
            otpVerify: findUser.otpVerify,
          });
        }
        if (findUser.stateId == CONST.BAN) {
          return res.status(400).send({
            success: false,
            message: responseMessage.BAN_MESSAGE,
          });
        }
        const payload = {
          id: findUser._id,
          email: findUser.email,
        };

        const token = await jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: "1d",
        });
        if (token) {
          res.status(200).send({
            success: true,
            message: responseMessage.LOGIN_SUCCESS,
            data: findUser,
            token: token,
          });
        }
      } else {
        res.status(400).send({
          success: false,
          message: responseMessage.INVALID_CREDENTIAL,
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: responseMessage.ACCOUNT_NOT_EXIST,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = auth;
