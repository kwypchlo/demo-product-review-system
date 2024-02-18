import { Button, Flex, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating } from "@smastrom/react-rating";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { FiSend } from "react-icons/fi";
import { z } from "zod";
import { api } from "@/utils/api";

type Inputs = {
  content: string;
  rating: number;
};

const schema = z.object({
  content: z.string().min(1, "Review content cannot be empty."),
  rating: z.number().int().min(1, "Please select review rating.").max(5),
});

export default function ReviewForm({ productId }: { productId: string }) {
  const toast = useToast();
  const utils = api.useUtils();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    mutate({ productId, ...data });
  };

  console.log(errors);

  // console.log(watch("example")); // watch input value by passing the name of it

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          Select your rating
        </Flex>

        <Textarea placeholder="Write your review here" {...register("content")} />

        <Flex justifyContent="space-between" alignItems="center">
          <Stack spacing={2}>
            {Object.entries(errors).map(([field, error]) => (
              <Text key={field} color="red.500">
                {error.message}
              </Text>
            ))}
          </Stack>
          <Button type="submit" isLoading={isLoading} colorScheme="green" leftIcon={<FiSend />}>
            Submit
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
