import { assertString } from "./deps.ts";
import { exportPages, importPages } from "https://raw.githubusercontent.com/takker99/scrapbox-userscript-std/0.14.1/rest/page-data.ts";

export async function main() {
  const sid = Deno.env.get("SID");
  const exportingProjectName = Deno.env.get("SOURCE_PROJECT_NAME"); //インポート元(本来はprivateプロジェクト)
  const importingProjectName = Deno.env.get("DESTINATION_PROJECT_NAME"); //インポート先(publicプロジェクト)
  const shouldDuplicateByDefault =
    Deno.env.get("SHOULD_DUPLICATE_BY_DEFAULT") === "True";

  // Validate SID
  if (!sid || sid.trim() === "") {
    throw new Error("SID is empty");
  }

  // Validate SOURCE_PROJECT_NAME
  if (!exportingProjectName || exportingProjectName.trim() === "") {
    throw new Error("SOURCE_PROJECT_NAME is empty");
  }

  // Validate DESTINATION_PROJECT_NAME
  if (!importingProjectName || importingProjectName.trim() === "") {
    throw new Error("DESTINATION_PROJECT_NAME is empty");
  }

console.log(`Exporting a json file from "/${exportingProjectName}"...`);
const result = await exportPages(exportingProjectName, {
  sid,
  metadata: true,
});
if (!result.ok) {
  const error = new Error();
  error.name = `${result.value.name} when exporting a json file`;
  error.message = result.value.message;
  throw error;
}
const { pages } = result.value;
console.log(`Export ${pages.length}pages:`);
for (const page of pages) {
  console.log(`\t${page.title}`);
}

const importingPages = pages.filter(({ lines }) => {
  if (lines.some((line) => line.text.includes("[private.icon]"))) {
    return false;
  } else if (lines.some((line) => line.text.includes("[public.icon]"))) {
    return true;
  } else {
    return shouldDuplicateByDefault;
  }
});

if (importingPages.length === 0) {
  console.log("No page to be imported found.");
} else {
  console.log(
    `Importing ${importingPages.length} pages to "/${importingProjectName}"...`,
  );
  const result = await importPages(importingProjectName, {
    pages: importingPages,
  }, {
    sid,
  });
  if (!result.ok) {
    const error = new Error();
    error.name = `${result.value.name} when importing pages`;
    error.message = result.value.message;
    throw error;
  }
  console.log(result.value);
  }
}

if (import.meta.main) {
  await main();
}
