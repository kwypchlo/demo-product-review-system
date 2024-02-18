import { Box, Center, Heading, Image, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { Rating } from "@smastrom/react-rating";
import Link from "next/link";
import { type RouterOutputs } from "@/utils/api";

type ProductCardProps = {
  product: RouterOutputs["products"]["getProducts"][number];
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Center as={Link} py={12} href={`/product/${product.id}`}>
      <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Box
          rounded={"lg"}
          mt={-12}
          pos={"relative"}
          height={"230px"}
          _after={{
            transition: "all .3s ease",
            content: '""',
            w: "full",
            h: "full",
            pos: "absolute",
            top: 5,
            left: 0,
            backgroundImage: `url(${product.image})`,
            filter: "blur(15px)",
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: "blur(20px)",
            },
          }}
        >
          <Image
            rounded={"lg"}
            height={230}
            width={282}
            objectFit={"cover"}
            src={product.image}
            alt={`Picture of ${product.name}`}
          />
        </Box>
        <Stack pt={10} align={"center"}>
          {/* <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            Brand
          </Text> */}
          <Heading fontSize={"md"} textAlign={"center"}>
            {product.name}
          </Heading>
          <Stack direction={"row"} align={"center"}>
            <Rating value={product.rating} readOnly style={{ maxWidth: 100 }} />

            <Text fontSize={"sm"} color={"gray.500"}>
              {product.reviewCount} reviews
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
