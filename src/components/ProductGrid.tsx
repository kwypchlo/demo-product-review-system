import { SimpleGrid, type SimpleGridProps } from "@chakra-ui/react";

export const ProductGrid = (props: SimpleGridProps) => {
  return (
    <SimpleGrid
      columns={{
        base: 2,
        md: 3,
        lg: 4,
        xl: 5,
      }}
      columnGap={{ base: "4", md: "6" }}
      rowGap={{ base: "8", md: "10" }}
      {...props}
    />
  );
};
