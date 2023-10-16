import {
  reactExtension,
  useApi,
  BlockStack,
  View,
  Button,
  Text,
  Heading,
} from '@shopify/ui-extensions-react/checkout';

import {useState} from 'react';

export default reactExtension(
  "purchase.checkout.block.render",
  () => <GachaDraw />,
);

function isGachaEligible(metafield) {
  return metafield !== undefined &&
    parseInt(metafield.metafield.value) === 1;
}

async function drawGacha(applyMetafieldChange, setGachaDrawn, setLoading) {
  setLoading(true);

  const gachaResult = Math.round(Math.random());
  console.log(`gacha result: ${gachaResult}`);

  console.log('applying metafield...');
  const result = await applyMetafieldChange({
    type: 'updateMetafield',
    namespace: 'custom',
    key: 'gacha_discount',
    valueType: 'integer',
    value: gachaResult,
  });
  console.log(`done: ${result.type}=${result.message}`);

  console.log('wait for some seconds...');
  setTimeout(() => {
    setLoading(false);
    setGachaDrawn(true);
  }, 3000);
}

function GachaDraw() {
  const [gachaDrawn, setGachaDrawn] = useState(false);
  const [loading, setLoading] = useState(false);

  const { applyMetafieldChange, appMetafields, metafields } = useApi();

  const gachaEligibility = appMetafields.current.find((metafield) => {
    return metafield.metafield.namespace === 'custom' &&
        metafield.metafield.key === 'gacha_eligibility';
  });
  console.log('gacha eligibility:');
  console.log(gachaEligibility);

  console.log('going through metafields');
  for (const metafield of metafields.current) {
    console.log(`key: ${metafield.key}=${metafield.value}`);
  }

  if (!isGachaEligible(gachaEligibility)) {
    return (
      <View>
      </View>
    );
  }

  return (
    <BlockStack border="base" borderWidth="base" cornerRadius="base" padding="base">
      <Heading>
        You are selected!
      </Heading>
      <Text appearance="subdued">
        Win a lottery to earn a discount for next purchase.
      </Text>
      <View>
        {!gachaDrawn
          ? <Button
              kind="secondary"
              loading={loading}
              onPress={() => {
                drawGacha(applyMetafieldChange, setGachaDrawn, setLoading);
              }}
            >
              Draw
            </Button>
          : <Text>
              See the result after checkout!
            </Text>
        }
      </View>
    </BlockStack>
  );
}
