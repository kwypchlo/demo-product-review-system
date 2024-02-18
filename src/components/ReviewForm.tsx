import { Button, Flex, Textarea } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rating } from "@smastrom/react-rating";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineSend } from "react-icons/ai";
import { z } from "zod";
import { api } from "@/utils/api";

type Inputs = {
  content: string;
  rating: number;
};

const schema = z.object({
  content: z.string().min(1),
  rating: z.number().int().min(1).max(5),
});

export default function ReviewForm({ productId }: { productId: string }) {
  const utils = api.useUtils();
  const { mutate, isLoading } = api.products.createReview.useMutation({
    onSuccess: () => {
      void utils.products.getProductById.invalidate({ id: productId });
      void utils.products.getProductReviews.invalidate({ productId });
    },
  });
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 0,
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

        {/* errors will return when field validation fails  */}
        {errors.content && <span>This field is required</span>}

        <Flex justifyContent={"flex-end"}>
          <Button type="submit" isLoading={isLoading} colorScheme="green" leftIcon={<AiOutlineSend />}>
            Submit
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
