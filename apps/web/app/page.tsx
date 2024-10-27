import Link from 'next/link';
// import { CardContent, CardFooter, Card } from '@/app/ui/components/view/molecule/card/card';
// import Form from './ui/components/view/molecule/form';
// import { authenticate } from './business/services/auth/sign-in.service';

import { fetchPosts } from './[id]/lib/data';
import { CalendarIcon } from 'lucide-react';
import BlogBreadcrumb from './[id]/components/blog-breadcrumb';
import Callout from './ui/components/view/molecule/callout';

export default async function Page() {
  const posts = await fetchPosts();

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="fixed left-10 top-4">
          <BlogBreadcrumb />
        </div>
        <div className="fixed bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-lg ">
          <Callout>
            FINGOO 워크스페이스로 이동하려면{'   '}
            <Link className="underline hover:text-gray-100" href="/blog">
              여기
            </Link>
            를 클릭하세요.
          </Callout>
        </div>
        <div className="mx-auto max-w-2xl ">
          <div className="flex flex-col items-center justify-center pb-28 pt-20">
            <h2 className="mb-2 text-4xl font-bold">FINGOO 블로그</h2>
          </div>
          {posts.map((post) => (
            <Link key={post.id} href={`/${post.id}`}>
              <BlogPostItem
                title={post.title}
                date={post.updatedAt.toISOString().slice(0, 10)}
                preview={post.preview}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

interface BlogPostProps {
  title: string;
  date: string;
  preview: string;
}

function BlogPostItem({ title, date, preview }: BlogPostProps) {
  return (
    <article className="mb-8 border-b border-gray-200 pb-8">
      <h2 className="mb-2 text-2xl font-bold">{title}</h2>
      <div className="mb-4 flex items-center text-sm text-gray-500">
        <CalendarIcon className="mr-2 h-4 w-4" />
        <time dateTime={date}>{date}</time>
      </div>
      <p className="line-clamp-3 text-ellipsis text-sm leading-7 text-gray-600">{preview}</p>
    </article>
  );
}

// function LoginFormPage() {
//   return (
//     <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
//       <div className="w-full max-w-md space-y-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight">Sign in to your account</h1>
//           <p className="mt-2 text-gray-500 dark:text-gray-400">
//             Enter your email and password below to access your account.
//           </p>
//         </div>
//         <Card>
//           <Form id="sign-in" action={authenticate}>
//             <CardContent className="space-y-4 pt-6">
//               <div className="space-y-2">
//                 <Form.TextInput label="Email" id="email" placeholder="m@example.com" />
//               </div>
//               <div className="space-y-2">
//                 <Form.PasswordInput label="Password" id="password" placeholder="" />
//               </div>
//             </CardContent>
//             <CardFooter>
//               <Form.SubmitButton label="Sign in" position="center" className="w-full" />
//             </CardFooter>
//           </Form>
//         </Card>
//         <div className="text-center text-sm text-gray-500 dark:text-gray-400">
//           Dont have an account?
//           <Link className="font-medium hover:underline" href="#">
//             Register
//           </Link>
//         </div>
//       </div>
//       <div className="mr-1.5 hidden"></div>
//     </div>
//   );
// }
