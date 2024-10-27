import BlogBreadcrumb from '../[id]/components/blog-breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

export default Layout;
