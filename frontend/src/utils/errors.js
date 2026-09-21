export function extractErrors(error) {
  if (error.response?.data?.errors) {
    const out = {};
    for (const [field, messages] of Object.entries(error.response.data.errors)) {
      out[field] = Array.isArray(messages) ? messages[0] : messages;
    }
    return out;
  }

  return {
    general: error.response?.data?.message || 'Something went wrong. Please try again.',
  };
}