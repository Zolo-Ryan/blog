import { returnDataContents } from "@/utils/io";
import Link from "next/link";

export default async function Home() {
  const files = await returnDataContents();
  
  return (
    <div>
      <ul>
        {files.map((fileName,i) =>{
          return(
            <Link href={`/${fileName.split('.')[0]}`} key={i}>
              <li>{fileName}</li>
            </Link>
          )
        })}
      </ul>
    </div>
  );
}
