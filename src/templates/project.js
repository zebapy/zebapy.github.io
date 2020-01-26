import React from 'react';
import Img from 'gatsby-image';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { graphql, Link } from 'gatsby';

import Layout from '../components/layout';
import PageHead from '../components/page-head';
import SEO from '../components/seo';
import PageActions from '../components/page-actions';

const ProjectTemplate = ({ data, pageContext }) => {
  const node = data.mdx;
  const {
    title,
    text,
    date,
    roles = [],
    tech = [],
    thumb,
    client,
    url,
    formattedDate,
    desktop,
    mobile
  } = node.frontmatter;

  const { previous: prev, next } = pageContext;

  const hasNextOrPrev = prev || next;

  return (
    <Layout>
      <SEO
        title={title}
        description={text}
        image={thumb.childImageSharp.fluid.src}
      />
      <article className="project-page">
        <PageHead
          title={title}
          text={text}
          backLink="/work"
          backLinkText="All Projects"
        >
          <dl className="project-details">
            {[
              {
                term: 'Year',
                text: <time time={date}>{formattedDate}</time>
              },
              {
                term: 'Client',
                text: client
              },
              {
                term: 'Roles',
                text: roles && roles.join(', ')
              },
              {
                term: 'tech',
                text: tech && tech.join(', ')
              }
            ].map(
              ({ term, text }) =>
                text && (
                  <div key={term} className="project-details-item">
                    <dt>{term}</dt>
                    <dd>{text}</dd>
                  </div>
                )
            )}
          </dl>
        </PageHead>

        <figure className="project-figure">
          {desktop && (
            <div className="project-desktop">
              <Img fluid={desktop.childImageSharp.fluid} />
            </div>
          )}
          {mobile && (
            <div className="project-mobile">
              <Img fluid={mobile.childImageSharp.fluid} />
            </div>
          )}
        </figure>

        <div className="project-wrap"></div>

        <div className="project-body">
          <MDXRenderer>{node.body}</MDXRenderer>
        </div>

        {url && (
          <div className="project-website-btn">
            <a href={url} className="btn">
              <span>Visit website</span>
            </a>
          </div>
        )}
      </article>

      {hasNextOrPrev && (
        <nav className="work-nav">
          <ul className="work-nav-list">
            {prev && (
              <li className="work-nav-item text-left">
                <Link to={prev.fields.slug} className="work-nav-link">
                  <span className="work-nav-title">
                    &larr; Previous Project
                  </span>
                  <span className="work-nav-text">
                    {prev.frontmatter.title}
                  </span>
                </Link>
              </li>
            )}
            <li className="work-nav-item text-center">
              <Link to="/work" className="work-nav-link">
                <span className="work-nav-title">All Projects</span>
              </Link>
            </li>
            {next && (
              <li className="work-nav-item text-right">
                <Link to={next.fields.slug} className="work-nav-link">
                  <span className="work-nav-title">Next Project &rarr;</span>
                  <span className="work-nav-text">
                    {next.frontmatter.title}
                  </span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </Layout>
  );
};

export default ProjectTemplate;

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
        text
        formattedDate: date(formatString: "YYYY")
        date
        tech
        client
        roles
        url

        thumb {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        desktop {
          childImageSharp {
            fluid(maxWidth: 1000) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        mobile {
          childImageSharp {
            fluid(maxWidth: 400) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
      body
    }
  }
`;
