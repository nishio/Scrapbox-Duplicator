import { assertEquals, assertThrows } from "https://deno.land/std@0.193.0/testing/asserts.ts";
import { main } from "./index.ts";

// Reset environment variables before each test
function resetEnv() {
  Deno.env.delete("SID");
  Deno.env.delete("SOURCE_PROJECT_NAME");
  Deno.env.delete("DESTINATION_PROJECT_NAME");
  Deno.env.delete("SHOULD_DUPLICATE_BY_DEFAULT");
}

Deno.test("environment variables should not be empty", async () => {
  resetEnv();
  Deno.env.set("SID", "");
  Deno.env.set("SOURCE_PROJECT_NAME", "source-project");
  Deno.env.set("DESTINATION_PROJECT_NAME", "dest-project");
  
  try {
    await main();
    throw new Error("Expected main() to throw an error");
  } catch (error: unknown) {
    if (error instanceof Error) {
      assertEquals(error.message, "SID is empty");
    } else {
      throw error;
    }
  }
});

Deno.test("environment variables validation with empty SOURCE_PROJECT_NAME", async () => {
  resetEnv();
  Deno.env.set("SID", "dummySid");
  Deno.env.set("SOURCE_PROJECT_NAME", "");
  Deno.env.set("DESTINATION_PROJECT_NAME", "dest-project");
  
  try {
    await main();
    throw new Error("Expected main() to throw an error");
  } catch (error: unknown) {
    if (error instanceof Error) {
      assertEquals(error.message, "SOURCE_PROJECT_NAME is empty");
    } else {
      throw error;
    }
  }
});

Deno.test("environment variables validation with empty DESTINATION_PROJECT_NAME", async () => {
  resetEnv();
  Deno.env.set("SID", "dummySid");
  Deno.env.set("SOURCE_PROJECT_NAME", "source-project");
  Deno.env.set("DESTINATION_PROJECT_NAME", "");
  
  try {
    await main();
    throw new Error("Expected main() to throw an error");
  } catch (error: unknown) {
    if (error instanceof Error) {
      assertEquals(error.message, "DESTINATION_PROJECT_NAME is empty");
    } else {
      throw error;
    }
  }
});

Deno.test("should handle missing environment variables", async () => {
  resetEnv();
  
  try {
    await main();
    throw new Error("Expected main() to throw an error");
  } catch (error: unknown) {
    if (error instanceof Error) {
      assertEquals(error.message, "SID is empty");
    } else {
      throw error;
    }
  }
});
