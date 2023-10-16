// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// Use JSDoc annotations for type safety
/**
* @typedef {import("../generated/api").RunInput} RunInput
* @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
* @typedef {import("../generated/api").Target} Target
* @typedef {import("../generated/api").ProductVariant} ProductVariant
*/

/**
* @type {FunctionRunResult}
*/
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// The configured entrypoint for the 'purchase.product-discount.run' extension target
/**
* @param {RunInput} input
* @returns {FunctionRunResult}
*/
export function run(input) {
  const metafield = input.cart.buyerIdentity.customer.metafield;
  if (!metafield) {
    console.error("No metafield available");
    return EMPTY_DISCOUNT;
  }

  try {
    const discountNextTime = parseInt(metafield.value);
    if (discountNextTime !== 1) {
      throw new Error(`Not eligible for discount: ${discountNextTime}`);
    }
  } catch (exception) {
    console.error(exception);
    return EMPTY_DISCOUNT;
  }

  return {
    discounts: [
      {
        targets: [
          {
            orderSubtotal: {
              excludedVariantIds: [],
            }
          },
        ],
        value: {
          percentage: {
            value: "10.0"
          }
        }
      }
    ],
    discountApplicationStrategy: DiscountApplicationStrategy.First
  };
};
