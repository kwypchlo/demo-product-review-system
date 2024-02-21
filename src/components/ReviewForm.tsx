import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Hide,
  Kbd,
  Text,
  Textarea,
  VStack,
  VisuallyHidden,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating } from "@smastrom/react-rating";
import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { z } from "zod";
import { api } from "@/utils/api";

const inputsSchema = z.object({
  content: z.string().min(1, "Review content cannot be empty.").max(360, "Review content is too long."),
  rating: z.number().int().min(1, "Please select review rating.").max(5),
});

export function ReviewForm({ productId }: { productId: number }) {
  const toast = useToast();
  const utils = api.useUtils();
  const errorColor = useColorModeValue("red.500", "red.300");

  // use useState to get a reference to the form element instead of using
  // useRef to be able to use the form element in the useEffect hook
  const [formNode, setFormNode] = useState<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof inputsSchema>>({
    resolver: zodResolver(inputsSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const { mutate, isLoading } = api.reviews.createReview.useMutation({
    onSuccess: () => {
      void utils.products.getProductById.invalidate({ id: productId });
      void utils.products.getProductReviews.invalidate({ productId });
      void utils.reviews.getMyProductReviews.invalidate({ productId });

      toast({ title: "Your review has been submitted.", status: "success" });

      reset(); // reset form after successful submission
    },
    onError: (error) => {
      toast({
        title: "There was an error submitting your review.",
        description: error.message,
        status: "error",
      });
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof inputsSchema>> = async (data) => {
    mutate({ productId, ...data });
  };

  useEffect(() => {
    const eventListener = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        formNode?.requestSubmit();
      }
    };

    formNode?.addEventListener("keydown", eventListener);

    return () => {
      formNode?.removeEventListener("keydown", eventListener);
    };
  }, [formNode]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} ref={setFormNode}>
      <Flex direction="column" gap={4} py={4}>
        <Flex alignItems="center" gap={4}>
          <Controller
            control={control}
            name="rating"
            rules={{
              validate: (rating) => rating > 0,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Rating
                value={value}
                onChange={onChange}
                style={{ maxWidth: 100 }}
                visibleLabelId="rating_label"
                onBlur={onBlur}
              />
            )}
          />
          <Text color={errors.rating ? errorColor : undefined}>Select your rating</Text>
        </Flex>

        <FormControl isInvalid={!!errors.content}>
          <VisuallyHidden>
            <FormLabel>Email</FormLabel>
          </VisuallyHidden>
          <Textarea placeholder="Write your review here" {...register("content")} />
          {errors.content ? (
            <FormErrorMessage>{errors.content.message}</FormErrorMessage>
          ) : (
            <FormHelperText>Please ensure your review adheres to our Code of Conduct</FormHelperText>
          )}
        </FormControl>

        <Flex justifyContent="flex-end" alignItems="center">
          <VStack spacing={2} alignItems="flex-end">
            <Button type="submit" isLoading={isLoading} colorScheme="blue" leftIcon={<FiSend />}>
              Submit
            </Button>
            <Hide below="md">
              <Box>
                <Kbd>⌘</Kbd> + <Kbd>Enter</Kbd>
              </Box>
            </Hide>
          </VStack>
        </Flex>
      </Flex>
    </form>
  );
}
