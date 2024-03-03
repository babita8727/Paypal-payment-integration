const { PRODUCT_MODEL } = require("../model/product.model");
const paypal = require("paypal-rest-sdk");
const dotenv = require("dotenv");
dotenv.config();
const { AUTH_MODEL } = require("../../auth/model/auth.model");
const { ORDER } = require("../model/order");
const { TRANSACTION_MODEL } = require("../model/purchase");

paypal.configure({
  mode: "sandbox", // change to 'live' for production
  client_id: "",
  client_secret: "",
});

const product = {};

/**
 * ADD PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.addProduct = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const saveProduct = await PRODUCT_MODEL.create(data);
    if (saveProduct) {
      res.status(200).send({
        success: true,
        message: responseMessage.PRODUCT_SAVE,
        data: saveProduct,
      });
    } else {
      res.status(400).send({
        success: false,
        message: responseMessage.PRODUCT_ERROR,
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * CREATE ORDER
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.createOrder = async (req, res, next) => {
  try {
    const data = req.body;
    data.createdBy = req.userId;
    const createOrder = await ORDER.create(data);
    if (createOrder) {
      res.status(200).send({
        success: true,
        message: "Order created successfully",
        data: createOrder,
      });
    } else {
      res.status(400).send({
        success: false,
        message: "Order not created",
      });
    }
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * PURCHASE PRODUCT
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.purchaseProduct = async (req, res, next) => {
  try {
    const data = req.body;
    const order = await ORDER.findOne({ _id: data.id });
    const findUser = await AUTH_MODEL.findOne({ _id: order.createdBy });
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
        payer_info: {
          first_name: findUser.username,
          email: findUser.email,
          // billing_address: {
          // line: findUser.address,
          // city: findUser.city,
          // state: findUser.state,
          // postal_code: findUser.zip,
          // country_code: "IN",
          // },
        },
      },

      redirect_urls: {
        return_url: "http://localhost:3000/users/success",
        cancel_url: "http://localhost:3000/users/cancel",
      },
      transactions: [
        {
          // item_list: {
          //   items: order.products.map((product) => ({
          //     name: product.productName,
          //     sku: product.productId,
          //     currency: data.currency,
          //     quantity: product.quantity,
          //   })),
          // },
          amount: {
            currency: "USD",
            total: order.totalAmount,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
            const txnData = {
              transactionId: payment.id,
              createdBy: req.userId,
              totalAmount: order.totalAmount,
              status: 1,
            };
            const createTxn = await TRANSACTION_MODEL.create(txnData);
          }
        }
      }
    });

    res.status(200).send({
      success: true,
      message: "Payment done successfully",
    });
  } catch (error) {
    console.log("error", error);
  }
};

/**
 * SUCCESS PAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.successPage = async (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const transaction = await TRANSACTION_MODEL.findOne({
    createdBy: req.userId,
  }).sort({ createdAt: -1 });

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: transaction.totalAmount,
        },
      },
    ],
  };

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    async function (error, payment) {
      if (error) {
        console.error(error.response);
        throw error;
      } else {
        const response = JSON.stringify(payment);
        const parsedResponse = JSON.parse(response);

        const transactionDetails = parsedResponse.transactions[0];
        console.log("parsedResponse", parsedResponse);
        return res.redirect("http://localhost:3000/users/success");
      }
    }
  );
};

/**
 * CANCEL PAGE
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
product.cancelPage = async (req, res, next) => {
  try {
    console.log("Payment Failed");
    return res.redirect("http://localhost:3000/failure");
  } catch (error) {
    console.log("error", error);
  }
};

module.exports = product;
