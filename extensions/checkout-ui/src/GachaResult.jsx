import {
  reactExtension,
  useApi,
  View,
  BlockStack,
  Text,
  Heading,
} from '@shopify/ui-extensions-react/customer-account';

export default reactExtension(
  "purchase.thank-you.block.render",
  () => <GachaResult />,
);

function GachaResult() {
  const { metafields } = useApi();

  console.log('thank you: going through metafields');
  for (const metafield of metafields.current) {
    console.log(`key: ${metafield.key}=${metafield.value}`);
  }

  const gachaDiscount = metafields.current.find((metafield) => {
    return metafield.namespace === 'custom' &&
        metafield.key === 'gacha_discount';
  });
  console.log('thank you: gacha discount:');
  console.log(gachaDiscount);

  return (
    <BlockStack border="base" borderWidth="base" cornerRadius="base" padding="base">
      {gachaDiscount.value === 1
        ? <Heading level="3">You got discount for your next purchase!</Heading>
        : <Heading level="3">Sorry, no discount this time :(</Heading>
      }
    </BlockStack>
  );
}
