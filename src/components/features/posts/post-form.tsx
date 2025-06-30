"use client";

import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
import { usePostForm } from "@/lib/hooks/use-post-form";
import { PostFormHeader, PostFormFields } from "./components/post-form";

interface PostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostForm({ onSuccess, onCancel }: PostFormProps) {
  const { form, onSubmit, isSubmitting, keywords, keywordsLoading } =
    usePostForm(onSuccess);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <PostFormHeader isSubmitting={isSubmitting} onCancel={onCancel} />
          <PostFormFields
            keywords={keywords}
            keywordsLoading={keywordsLoading}
          />
        </form>
      </Form>
    </motion.div>
  );
}
