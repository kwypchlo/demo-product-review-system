import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  AspectRatio,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  Hide,
  Link,
  Show,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import Image from "next/image";
import { useRouter } from "next/router";
import { FiChevronsLeft } from "react-icons/fi";
import sections from "./sections.json";
import ProductReviewsWidget from "@/components/ProductReviewsWidget";
import { api } from "@/utils/api";

export default function Product() {
  const router = useRouter();
  const { data: product, isLoading } = api.products.getProductById.useQuery(
    { id: router.query.id as string },
    { enabled: router.isReady },
  );

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>No product found</div>;

  return (
    <Flex direction={["column", null, "row"]} gap={8}>
      <Flex flex={2} direction="column">
        <AspectRatio ratio={4 / 3} borderRadius={{ base: "md", md: "xl" }} overflow="hidden">
          <>
            <Skeleton width={480} height={360} />
            <Image src={product.image} alt={product.name} width={480} height={360} draggable="false" />
          </>
        </AspectRatio>

        <Show above="md">
          {sections.map((section) => (
            <Flex key={section.title} my={4} gap={4} direction="column">
              <Divider />
              <Heading as="h3" size="sm">
                {section.title}
              </Heading>
              <Text>{section.content}</Text>
            </Flex>
          ))}
        </Show>
      </Flex>

      <Flex flex={3} direction="column">
        <Box>
          <Button as={Link} href="/" leftIcon={<FiChevronsLeft />} variant="link">
            Back to products
          </Button>
        </Box>

        <VStack spacing={6} mb={10} alignItems="flex-start">
          <Heading>{product.name}</Heading>

          <HStack spacing={4}>
            <Rating value={product.rating} readOnly style={{ maxWidth: 100 }} />
            <Text>
              {Math.round(product.rating * 100) / 100} out of {product.reviewCount} reviews
            </Text>
          </HStack>

          <Text fontWeight="semibold">{product.description}</Text>

          <Hide above="md">
            <Accordion allowToggle w="full">
              {sections.map((section) => (
                <AccordionItem key={section.title}>
                  <Heading as="h3" fontWeight="normal" size="sm">
                    <AccordionButton>
                      <Box as="span" flex="1" textAlign="left">
                        {section.title}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </Heading>
                  <AccordionPanel pb={4}>{section.content}</AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Hide>
        </VStack>

        <ProductReviewsWidget product={product} />
      </Flex>
    </Flex>
  );
}
